var key = 'd2d65dc2900f714cfa1e3670e3400bb6bd38c0f4e9f9cb374';
var dictionary = {};
dictionary.results = [];

dictionary.lookup = function(wordList, callback)
{
  if(wordList.length === 0){return callback(dictionary.results);}
  this.lookupOne(wordList[0], function(data)
  {
    dictionary.results.push(data);
    dictionary.lookup(wordList.slice(1), callback);
  });
};

dictionary.lookupOne = function(word, callback)
{
  var request =
    'http://api.wordnik.com:80/v4/word.json/' +
    word +
    '/definitions?limit=10&includeRelated=false&useCanonical=false&includeTags=false&api_key=' +
    key;

  $.ajax({url: request })
      .done(function(data)
      {
        var obj = {};
        obj.word = word;
        obj.definition = data[0] ? data[0].text : null;
        return callback(obj);
      });
};

module.exports = dictionary;
