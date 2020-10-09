module.exports = {
    format: (fmt, ...args) => {
        return fmt
            .split("%s").reduce((aggregate, chunk, i) =>
                aggregate + chunk + (args[i] || ""), "");
    },
    formatDate: (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    },
    chunkArray:function(myArray, chunk_size){
        let index = 0,arrayLength = myArray.length,tempArray = [];        
        for (index = 0; index < arrayLength; index += chunk_size) {
            myChunk = myArray.slice(index, index+chunk_size);
            // Do something if you want with the group
            tempArray.push(myChunk);
        }
    
        return tempArray;
    }    
}