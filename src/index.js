/**
 * Created by keyvan on 8/27/16.
 */
function * keyValues(obj) {
    for (const key of Object.keys(obj))
        yield [key, obj[key]];
}

function * enumerate(array) {
    let index = 0;
    for (const element of array) {
        yield [index, element];
        index++;
    }
}

const hasProperties = obj => obj.properties && obj.identity && obj.identity.low;

const parseRecord = record => {
    // If null or value
    if (!record || typeof record !== 'object')
        return record;
    else
        // If it's a number
        if ((record.low || record.low === 0) && record.high === 0)
            return record.low;
        // If it's an array
        else if (record['0']) {
            const result = [];
            let index = 0;
            let current = record['0'];
            while (current) {
                result.push(parseRecord(current));
                index++;
                current = record[String(index)];
            }
            return result;
        } else { // It's an object by this point
            const properties = hasProperties(record) ? record.properties : record;
            const result = {};
            for (let [key, value] of keyValues(properties)) {
                value = parseRecord(value);
                result[key] = value;
            }
            return result;
        }
};

const parseNeo4jResponse = response => {
    const result = [];
    for (const record of response.records)
        if (record.length == 1)
            result.push(parseRecord(record._fields[0]));
        else {
            const parsedRecord = {};
            for (const [index, key] of enumerate(record.keys))
                parsedRecord[key] = parseRecord(record._fields[index]);
            result.push(parsedRecord);
        }
    return result;
};

const parser = {
    parse: neo4jHttpResponse => {
        try {
            return parseNeo4jResponse(neo4jHttpResponse);
        }
        catch (error) {
            throw new Error(`Parse error: ${error.message}`);
        }
    },
    parseRecord
};

export default parser;
