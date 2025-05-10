import mongoose from 'mongoose';
import { parse } from 'csv-parse';
import { readFile } from 'fs/promises';
import { Readable } from 'stream';
import path from 'path';

// Import all models
import { Administration } from '../models/administration';
import { Track } from '../models/track';
import { Station } from '../models/station';
import { Client } from '../models/client';
import { Examiner } from '../models/examiner';
import { Examinee } from '../models/examinee';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maxfame-test';
const PROJECT_FILES_DIR = path.join(__dirname, '..', 'project_files');

interface AdminTemplateStation {
    readonly id: string;
}

interface AdminTemplateTrack {
    readonly trackId: string;
    readonly stations: string[];
}

interface AdminTemplateItem {
    readonly adminId: string;
    readonly tracks: AdminTemplateTrack[];
}

interface StationConfig {
    readonly stationId: string;
    readonly name: string;
}

interface TrackConfig {
    readonly trackId: string;
    readonly name: string;
    readonly stations: StationConfig[];
}

interface AdminConfig {
    readonly adminId: string;
    readonly name: string;
    readonly tracks: TrackConfig[];
}

interface SetupConfig {
    readonly administrations: AdminConfig[];
}

async function clearExistingData() {
    try {
        // Delete in specific order to avoid reference issues
        await Station.deleteMany({});
        await Track.deleteMany({});
        await Administration.deleteMany({});
        await Client.deleteMany({});
        await Examiner.deleteMany({});
        await Examinee.deleteMany({});
        console.log('All existing data cleared successfully');
    } catch (error) {
        console.error('Error clearing data:', error);
        throw error;
    }
}

async function parseCsvFile(filePath: string): Promise<any[]> {
    const fileContent = await readFile(filePath);
    const records: any[] = [];
    
    const parser = parse({
        columns: true,
        skip_empty_lines: true
    });

    const bufferStream = new Readable();
    bufferStream.push(fileContent);
    bufferStream.push(null);

    for await (const record of bufferStream.pipe(parser)) {
        records.push(record);
    }

    return records;
}

async function createAdministrations(config: SetupConfig) {
    try {
        console.log('\nCreating administrations...');
        const createdAdmins = [];

        for (const adminConfig of config.administrations) {
            console.log(`\nCreating administration: ${adminConfig.name} (${adminConfig.adminId})`);
            
            // Create administration
            const administration = new Administration({ 
                name: adminConfig.name,
                adminId: adminConfig.adminId 
            });
            await administration.save();
            console.log(`✓ Created administration: ${administration.name} (${administration._id})`);

            const trackIds = [];

            // Create tracks for this administration
            for (const trackConfig of adminConfig.tracks) {
                const track = new Track({
                    name: trackConfig.name,
                    trackId: trackConfig.trackId,
                    administrationId: administration._id
                });
                await track.save();
                trackIds.push(track._id);
                console.log(`  ✓ Created track: ${track.name} (${track._id})`);

                // Create stations for this track
                const stationPromises = trackConfig.stations.map(stationConfig => 
                    Station.create({
                        name: stationConfig.name,
                        stationId: stationConfig.stationId,
                        trackId: track._id
                    })
                );

                const stations = await Promise.all(stationPromises);
                console.log(`    ✓ Created ${stations.length} stations for ${track.name}`);
            }

            // Update administration with track references
            await Administration.findByIdAndUpdate(
                administration._id,
                { $set: { tracks: trackIds } }
            );

            createdAdmins.push(administration);
            console.log(`✓ Completed setup for ${administration.name}`);
        }

        return createdAdmins;
    } catch (error) {
        console.error('Error creating administrations:', error);
        throw error;
    }
}

async function uploadParticipants() {
    try {
        console.log('\nUploading participants data...');

        // Upload Clients
        console.log('\nUploading standardized clients...');
        const clientsData = await parseCsvFile(path.join(PROJECT_FILES_DIR, 'standardized_clients.csv'));
        const clientPromises = clientsData.map(client => 
            Client.findOneAndUpdate(
                { clientId: client.ClientID },
                { 
                    clientId: client.ClientID,
                    name: client.Name 
                },
                { upsert: true, new: true }
            )
        );
        const clients = await Promise.all(clientPromises);
        console.log(`✓ Successfully uploaded ${clients.length} clients`);

        // Upload Examiners
        console.log('\nUploading examiners...');
        const examinersData = await parseCsvFile(path.join(PROJECT_FILES_DIR, 'examiners.csv'));
        const examinerPromises = examinersData.map(examiner =>
            Examiner.findOneAndUpdate(
                { examinerId: examiner.ExaminerID },
                { 
                    examinerId: examiner.ExaminerID,
                    name: examiner.Name 
                },
                { upsert: true, new: true }
            )
        );
        const examiners = await Promise.all(examinerPromises);
        console.log(`✓ Successfully uploaded ${examiners.length} examiners`);

        // Upload Examinees
        console.log('\nUploading examinees...');
        const examineesData = await parseCsvFile(path.join(PROJECT_FILES_DIR, 'examinees.csv'));
        const examineePromises = examineesData.map(examinee =>
            Examinee.findOneAndUpdate(
                { examineeId: examinee.ExamineeID },
                { 
                    examineeId: examinee.ExamineeID,
                    name: examinee.Name 
                },
                { upsert: true, new: true }
            )
        );
        const examinees = await Promise.all(examineePromises);
        console.log(`✓ Successfully uploaded ${examinees.length} examinees`);

        return {
            clients: clients.length,
            examiners: examiners.length,
            examinees: examinees.length
        };
    } catch (error) {
        console.error('Error uploading participants:', error);
        throw error;
    }
}

async function setup() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('\nClearing existing data...');
        await clearExistingData();

        // Load and parse admin template
        const adminTemplatePath = path.join(PROJECT_FILES_DIR, 'admin_template.json');
        const adminTemplate: AdminTemplateItem[] = JSON.parse(await readFile(adminTemplatePath, 'utf-8'));

        // Create configuration from template
        const config: SetupConfig = {
            administrations: adminTemplate.map((admin, index) => ({
                adminId: admin.adminId,
                name: `${index === 0 ? 'Spring' : 'Fall'} 2025 Administration`,
                tracks: admin.tracks.map(trackTemplate => ({
                    trackId: trackTemplate.trackId,
                    name: `Track ${trackTemplate.trackId.split('_')[1]} - ${index === 0 ? 'Spring' : 'Fall'} 2025`,
                    stations: trackTemplate.stations.map(stationId => ({
                        stationId,
                        name: `Station ${stationId.split('_')[1]} - Track ${trackTemplate.trackId.split('_')[1]}`
                    }))
                }))
            }))
        };

        // Create administrations, tracks, and stations
        const admins = await createAdministrations(config);

        // Upload all participants
        await uploadParticipants();

        // Print summary
        const summary = {
            administrations: await Administration.countDocuments(),
            tracks: await Track.countDocuments(),
            stations: await Station.countDocuments(),
            clients: await Client.countDocuments(),
            examiners: await Examiner.countDocuments(),
            examinees: await Examinee.countDocuments()
        };

        console.log('\nSetup completed successfully!');
        console.log('Summary:', summary);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error during setup:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Only run if this script is called directly
if (require.main === module) {
    setup();
}
