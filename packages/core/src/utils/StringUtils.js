export default class StringUtils
{
    /**
     * Returns a string of the number as an integer with leading zeros to fill the string out
     * to a certain number of digits.
     * @method numberPadding
     * @param {Number} [totalDigits=2] The total number of digits to be displayed.
     * @return {String} The number string.
     */
    static numberPadding(num, totalDigits = 2)
    {
        let leader;

        if (num < 0)
        {
            num *= -1;
            leader = '-';
        }

        var s = String(Math.floor(num));

        while (s.length < totalDigits)
        {
            s = `0${s}`;
        }

        if (leader)
        {
            s = leader + s;
        }

        return s;
    }

    /**
     * Returns a formatted string, similar to the printf() function in many languages.
     * This simplified version substitutes "%s" with the arguments in order. To escape "%s",
     * use "%%s".
     * @method format
     * @param {String} str - Input string to format
     * @param {Array|*} args An array or list of arguments for formatting.
     * @return {String} The substituted string.
     */
    static format(str, ...args)
    {
        if (args.length < 1)
        {
            return str;
        }

        return str
            .replace(/([^%]|^)%(?:(\d+)\$)?s/g, (p0, p, position) => {
                if (position)
                {
                    return p + args[parseInt(position) - 1];
                }
                return p + args.shift();
            })
            .replace(/%%s/g, '%s');
    }

    /**
     * Returns a reversed copy of the string.
     * @method reverse
     * @static
     * @param {String} str String to reverse.
     * @return {String} The reversed string.
     */
    static reverse(str)
    {
        let o = '';

        for (let i = str.length - 1; i >= 0; i--)
        {
            o += str[i];
        }

        return o;
    }
}