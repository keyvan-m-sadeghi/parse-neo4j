/**
 * Created by keyvan on 8/27/16.
 */

import {to64BitsIntegerString} from './integer64';

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

const hasProperties = obj => obj.properties && obj.identity && (typeof obj.identity.low === 'number');

const parseRecord = record => {
    // If null or value
    if (!record || typeof record !== 'object')
        return record;
    else
        // If it's a number
        if (Object.keys(record).length === 2 &&
            typeof record.low === 'number' && typeof record.high === 'number')
            if ((record.high === 0 && record.low >=0) || (record.high === -1 && record.low < 0))
                return record.low;
            else
                return to64BitsIntegerString(record.high, record.low);
        // If it's an array
        else if (typeof(record['0']) !== 'undefined') {
            const result = [];
            let index = 0;
            let current = record['0'];
            while (typeof(current) !== 'undefined') {
                result.push(parseRecord(current));
                index++;
                current = record[String(index)];
            }
            return result;
        } else { // It's an object by this point
            const properties = hasProperties(record) ? record.properties : record;
            if (!record.identity && Object.keys(properties).length === 0)
                return [];
            const result = {};
            if (record.identity)
                result.id = parseRecord(record.identity);
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

const parse = neo4jHttpResponse => {
    try {
        return parseNeo4jResponse(neo4jHttpResponse);
    }
    catch (error) {
        throw new Error(`Parse error: ${error.message}`);
    }
};

export {parse, parseRecord};
