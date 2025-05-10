import mongoose from 'mongoose';
import { Administration } from '../models/administration';
import { Track } from '../models/track';
import { Station } from '../models/station';

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/maxfame-test';

async function clearExistingData() {
    console.log('Clearing existing tracks and stations...');
    await Track.deleteMany({});
    await Station.deleteMany({});
    await Administration.updateMany({}, { $set: { tracks: [] } });
}

async function setupStationsAndTracks() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await clearExistingData();

        // Get all administrations
        const administrations = await Administration.find();
        console.log(`Found ${administrations.length} administrations`);

        if (administrations.length === 0) {
            console.log('No administrations found. Please create administrations first.');
            process.exit(1);
        }

        for (const admin of administrations) {
            console.log(`\nProcessing administration: ${admin.name} (${admin._id})`);

            const trackIds = [];

            // Create 2 tracks for each administration
            for (let i = 1; i <= 2; i++) {
                const trackName = `Track ${i} - ${admin.name}`;
                console.log(`Creating track: ${trackName}`);

                const track = new Track({
                    name: trackName,
                    administrationId: admin._id
                });
                await track.save();
                trackIds.push(track._id);

                // Create 3 stations for each track
                for (let j = 1; j <= 3; j++) {
                    const stationName = `Station ${j} - ${trackName}`;
                    console.log(`Creating station: ${stationName}`);

                    const station = new Station({
                        name: stationName,
                        trackId: track._id
                    });
                    await station.save();
                }
            }

            // Update administration with track references
            await Administration.findByIdAndUpdate(
                admin._id,
                { $set: { tracks: trackIds } }
            );
            console.log(`Updated administration ${admin.name} with ${trackIds.length} tracks`);
        }

        // Print summary
        const trackCount = await Track.countDocuments();
        const stationCount = await Station.countDocuments();
        
        console.log('\nSetup completed successfully!');
        console.log('Summary:');
        console.log(`- Administrations: ${administrations.length}`);
        console.log(`- Tracks created: ${trackCount}`);
        console.log(`- Stations created: ${stationCount}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

setupStationsAndTracks();
