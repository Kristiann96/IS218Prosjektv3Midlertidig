/**
 * Data Service Module
 * Handles all database operations for the application
 */

const supabase = require('../config/database');

/**
 * Fetches shelter data from the database
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Object>} - Object containing data and any error
 */
async function getShelterData(limit = 100) {
    try {
        const { data, error } = await supabase
            .from('osm_shelter_type_basic_hut_agder')
            .select('*')
            .limit(limit);

        if (error) {
            console.error('Error fetching shelter data:', error);
            throw error;
        }

        console.log('Shelter Data Count:', data?.length);
        return { data, error: null };
    } catch (error) {
        console.error('Shelter data service error:', error);
        return { data: null, error };
    }
}

/**
 * Fetches bunker data from the database
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Object>} - Object containing data and any error
 */
async function getBunkerData(limit = 65) {
    try {
        const { data, error } = await supabase
            .from('tilfluktsrom_offentlige')
            .select('*')
            .limit(limit);

        if (error) {
            console.error('Error fetching bunker data:', error);
            throw error;
        }

        console.log('Bunker Data Count:', data?.length);
        if (data && data.length > 0) {
            console.log('Sample Bunker Data:', data[0]); // Log sample for debugging
        }

        return { data, error: null };
    } catch (error) {
        console.error('Bunker data service error:', error);
        return { data: null, error };
    }
}

/**
 * Fetches both shelter and bunker data in one call
 * @returns {Promise<Object>} - Object containing both datasets and any errors
 */
async function getAllData() {
    const [shelterResult, bunkerResult] = await Promise.all([
        getShelterData(),
        getBunkerData()
    ]);

    return {
        shelterData: shelterResult.data,
        bunkerData: bunkerResult.data,
        error: shelterResult.error || bunkerResult.error
    };
}

module.exports = {
    getShelterData,
    getBunkerData,
    getAllData
};