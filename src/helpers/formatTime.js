import moment from 'moment';

/**
 * Formats a given time string to a specified format.
 * @param {string} time - The input time string.
 * @param {string} inputFormat - The format of the input time.
 * @param {string} outputFormat - The desired format for the output time.
 * @returns {string} - The formatted time string.
 */
 const formatTime = (time, inputFormat = 'HH:mm', outputFormat = 'hh:mm A') => {
    if (!time) return '----'; // Return an empty string if time is invalid or undefined

    if(time.includes('T')){
        //@ts-ignore
        time = moment.parseZone(time);
  
    }
    return moment(time, inputFormat).format(outputFormat);
};

export default formatTime