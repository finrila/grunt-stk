/**
 * 去注释
 */
module.exports = function(src, options) {
    options = options || {
		line: true,
		block: true
	};
	
    if (options.line) {
		src = src.replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/gm, '\n');
    }
    if (options.block) {
        src = src.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n'); 
    }
    return src;
};