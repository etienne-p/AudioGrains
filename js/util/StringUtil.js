lib.StringUtil = {

    parseTemplate: function(html, data) {
        function injectValue(match) {
            var prop = match.substring(2, match.length - 2);
            return (prop in data && data.hasOwnProperty(prop)) ? data[prop] : '';
        }
        return html.replace(/{{(\w+)}}/g, injectValue);
    },

    escapeQuotes: function(input) {
        return input.replace(/["']/g, '\"');
    }
}