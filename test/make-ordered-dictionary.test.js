"use strict";

const assert = require('node:assert/strict');
const test = require('node:test');
const makeOrderedDictionary = require('../lib/Store/make-ordered-dictionary').default;

test('fromJSON rebuilds ID lookups and removes stale entries', () => {
    const dictionary = makeOrderedDictionary(item => item.id);
    dictionary.upsert({ id: 'stale', value: 1 }, 'append');

    dictionary.fromJSON([
        { id: 'first', value: 2 },
        { id: 'second', value: 3 }
    ]);

    assert.equal(dictionary.get('stale'), undefined);
    assert.deepEqual(dictionary.get('first'), { id: 'first', value: 2 });
    assert.deepEqual(dictionary.get('second'), { id: 'second', value: 3 });
    assert.deepEqual(dictionary.array.map(item => item.id), ['first', 'second']);
});

test('update reports whether it replaced an item', () => {
    const dictionary = makeOrderedDictionary(item => item.id);
    dictionary.fromJSON([{ id: 'first', value: 1 }]);

    assert.equal(dictionary.update({ id: 'first', value: 2 }), true);
    assert.deepEqual(dictionary.get('first'), { id: 'first', value: 2 });
    assert.equal(dictionary.update({ id: 'missing', value: 3 }), false);
});
