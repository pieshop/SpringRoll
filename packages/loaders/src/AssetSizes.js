import {include} from '@springroll/core';

/**
 * Manages filtering of loads to load assets sized for the current device.
 * @class AssetSizes
 * @private
 */
var AssetSizes = function()
{
    /**
     * The collection of size objects
     * @property {Array} _sizes
     * @private
     */
    this._sizes = [];

    /**
     * The map of size objects
     * @property {_sizesMap} _sizesMap
     * @private
     */
    this._sizesMap = {};

    /**
     * The preferred size
     * @property {Object} _preferredSize
     * @readOnly
     */
    this._preferredSize = null;
};

/**
 * The URL substitution string.
 * @property {String} SIZE_TOKEN
 * @static
 * @default  "%SIZE%"
 */
AssetSizes.SIZE_TOKEN = "%SIZE%";

/**
 * Removes all currently defined sizes.
 * @method  reset
 */
AssetSizes.prototype.reset = function()
{
    this._sizes.length = 0;
    this._sizesMap = {};
};

/**
 * Adds a new size definition.
 * @method define
 * @param {String} id The name of the folder which contains assets of this size.
 * @param {int} maxSize The maximum size in points capable of using this size.
 * @param {Number} scale The scale of assets
 * @param {Array} fallback The size fallbacks if this size isn't available
 *      for the current asset request.
 */
AssetSizes.prototype.define = function(id, maxSize, scale, fallback)
{
    var size = {
        id: id,
        maxSize: maxSize,
        scale: scale,
        fallback: fallback
    };

    this._sizesMap[id] = size;
    this._sizes.push(size);

    // Sor from smallest to largest maxSize
    this._sizes.sort(function(a, b)
    {
        return a.maxSize - b.maxSize;
    });
};

/**
 * Update a URL by size
 * @method  filter
 * @param  {String} url The asset to load
 * @param {Object} [size] The currrent size object
 * @param {Object} [size.id] The name of the current size
 * @return {String} The formatted url
 */
AssetSizes.prototype.filter = function(url, size)
{
    size = size || this._preferredSize;
    return url.replace(AssetSizes.SIZE_TOKEN, size.id);
};

/**
 * Make sure we have a token
 * @method  test
 * @param  {String}  url The URL to test
 * @return {Boolean} If we have the token
 */
AssetSizes.prototype.test = function(url)
{
    return url.indexOf(AssetSizes.SIZE_TOKEN) > -1;
};

/**
 * Get a size based on the current asset sizes supported
 * @method size
 * @param  {Object} [supported] Return the preferred size if nothing is set
 * @return {Object} Return the size object with id, scale, maxSize and fallback keys
 */
AssetSizes.prototype.size = function(supported)
{
    var size = this._preferredSize;
    var fallback = size.fallback;

    // There's custom support and it says we don't support
    // the default size.
    if (supported && !supported[size.id])
    {
        for (var i = 0, len = fallback.length; i < len; i++)
        {
            var alt = fallback[i];

            // Undefined means we support it, or true
            if (supported[alt] !== false)
            {
                size = this._sizesMap[alt];
                break;
            }
        }
    }
    // Umm something's wrong, the asset doesn't support
    // either the current size or any of the fallbacks
    if (!size)
    {
        throw "Asset does not support any valid size";
    }
    return size;
};

/**
 * Recalculate the current preferred size based on width and height
 * @method refresh
 * @param  {Number} width  The width of the stage
 * @param  {Number} height The height of the stage
 * @return {Object} The size
 */
AssetSizes.prototype.refresh = function(width, height)
{
    var minSize = Math.min(width, height);
    var size = null;
    var sizes = this._sizes;
    var devicePixelRatio = include('devicePixelRatio', false) || 1;

    // Check the largest first
    for (var i = sizes.length - 1; i >= 0; --i)
    {
        if (sizes[i].maxSize / devicePixelRatio > minSize)
        {
            size = sizes[i];
        }
        else
        {
            break;
        }
    }
    this._preferredSize = size;
};

/**
 * Destroy and don't use after this
 * @method destroy
 */
AssetSizes.prototype.destroy = function()
{
    this._preferredSize = null;
    this._sizes = null;
    this._sizesMap = null;
};

export default AssetSizes;