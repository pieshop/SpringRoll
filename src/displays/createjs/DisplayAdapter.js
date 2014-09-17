/**
*  @modules cloudkid.createjs
*/
(function(undefined){
	
	/**
	*  Provide a normalized way to get size, position, scale values
	*  as well as provide reference for different geometry classes.
	*  @class createjs.DisplayAdapter
	*/
	var DisplayAdapter = {};

	/**
	*  The geometry class for Circle
	*  @property {Function} Circle
	*  @readOnly
	*  @static
	*  @default createjs.Circle
	*/
	DisplayAdapter.Circle = include('createjs.Circle', false);

	/**
	*  The geometry class for Ellipse
	*  @property {Function} Ellipse
	*  @readOnly
	*  @static
	*  @default createjs.Ellipse
	*/
	DisplayAdapter.Ellipse = include('createjs.Ellipse', false);

	/**
	*  The geometry class for Rectangle
	*  @property {Function} Rectangle
	*  @readOnly
	*  @static
	*  @default createjs.Rectangle
	*/
	DisplayAdapter.Rectangle = include('createjs.Rectangle');

	/**
	*  The geometry class for Sector
	*  @property {Function} Sector
	*  @readOnly
	*  @static
	*  @default createjs.Sector
	*/
	DisplayAdapter.Sector = include('createjs.Sector', false);

	/**
	*  The geometry class for point
	*  @property {Function} Point
	*  @readOnly
	*  @static
	*  @default createjs.Point
	*/
	DisplayAdapter.Point = include('createjs.Point');

	/**
	*  The geometry class for Polygon
	*  @property {Function} Polygon
	*  @readOnly
	*  @static
	*  @default createjs.Polygon
	*/
	DisplayAdapter.Polygon = include('createjs.Polygon', false);

	/**
	*  If the rotation is expressed in radians
	*  @property {Boolean} useRadians
	*  @readOnly
	*  @static
	*  @default false
	*/
	DisplayAdapter.useRadians = false;

	/**
	*  Gets the object's boundaries in its local coordinate space.
	*  @method getLocalBounds
	*  @static
	*  @param {createjs.DisplayObject} object The createjs display object
	*  @return {Rectangle} A rectangle with added right and bottom properties.
	*/
	DisplayAdapter.getLocalBounds = function(object)
	{
		var bounds;
		if(object.nominalBounds)
		{
			//start by using nominal bounds, if it was exported from Flash, since it
			//should be fast and pretty accurate
			bounds = object.nominalBounds.clone();
		}
		else if(object.width !== undefined && object.height !== undefined)
		{
			//next check for a width and height that someone might have set up,
			//like our Button class has.
			//this also needs to take into account the registration point, as that affects the
			//positioning of the art
		}
		else
		{
			//finally fall back to using EaselJS's getBounds().
		}
		bounds.right = bounds.x + bounds.width;
		bounds.bottom = bounds.y + bounds.height;
		return bounds;
	};

	/**
	*  Normalize the object scale
	*  @method getScale
	*  @static
	*  @param {createjs.DisplayObject} object The createjs display object
	*  @param {String} [direction] Either "x" or "y" to return a specific value
	*  @return {object|Number} A scale object with x and y keys or a single number if direction is set
	*/
	DisplayAdapter.getScale = function(object, direction)
	{
		if (direction !== undefined)
		{
			return object["scale" + direction.toUpperCase()];
		}
		return {
			x : object.scaleX,
			y : object.scaleY
		};
	};

	/**
	*  Normalize the object position setting
	*  @method setPosition
	*  @static
	*  @param {createjs.DisplayObject} object The createjs display object
	*  @param {object|Number} position The position object or the value
	* 		if the direction is set.
	*  @param {Number} [position.x] The x value
	*  @param {Number} [position.y] The y value
	*  @param {String} [direction] Either "x" or "y" value
	*  @return {createjs.DisplayObject} Return the object for chaining
	*/
	DisplayAdapter.setPosition = function(object, position, direction)
	{
		if (direction !== undefined)
		{
			object[direction] = position;
		}
		else
		{
			if (position.x !== undefined) object.x = position.x;
			if (position.y !== undefined) object.y = position.y;
		}
		return object;
	};

	/**
	*  Normalize the object position getting
	*  @method getPosition
	*  @static
	*  @param {createjs.DisplayObject} object The createjs display object
	*  @param {String} [direction] Either "x" or "y", default is an object of both
	*  @return {Object|Number} The position as an object with x and y keys if no direction
	*		value is set, or the value of the specific direction
	*/
	DisplayAdapter.getPosition = function(object, direction)
	{
		if (direction !== undefined)
		{
			return object[direction];
		}
		return {
			x : object.x,
			y : object.y
		};
	};

	/**
	*  Normalize the object scale setting
	*  @method setScale
	*  @static
	*  @param {createjs.DisplayObject} object The createjs Display object
	*  @param {Number} scale The scaling object or scale value for x and y
	*  @param {String} [direction] Either "x" or "y" if setting a specific value, default
	* 		sets both the scale x and scale y.
	*  @return {createjs.DisplayObject} Return the object for chaining
	*/
	DisplayAdapter.setScale = function(object, scale, direction)
	{
		if (direction !== undefined)
		{
			object["scale" + direction.toUpperCase()] = scale;
		}
		else
		{
			object.scaleX = object.scaleY = scale;
		}
		return object;
	};

	/**
	*  Set the pivot or registration point of an object
	*  @method setPivot
	*  @static
	*  @param {createjs.DisplayObject} object The createjs Display object
	*  @param {object|Number} pivot The object pivot point or the value if the direction is set
	*  @param {Number} [pivot.x] The x position of the pivot point
	*  @param {Number} [pivot.y] The y position of the pivot point
	*  @param {String} [direction] Either "x" or "y" the value for specific direction, default
	* 		will set using the object.
	*  @return {createjs.DisplayObject} Return the object for chaining
	*/
	DisplayAdapter.setPivot = function(object, pivot, direction)
	{
		if (direction !== undefined)
		{
			object["reg" + direction.toUpperCase()] = pivot;
		}
		object.regX = pivot.x;
		object.regY = pivot.y;
		return object;
	};

	/**
	*  Set the hit area of the shape
	*  @method setHitArea
	*  @static
	*  @param {createjs.DisplayObject} object The createjs Display object
	*  @param {Object} shape The geometry object
	*  @return {createjs.DisplayObject} Return the object for chaining
	*/
	DisplayAdapter.setHitArea = function(object, shape)
	{
		object.hitShape = shape;
		return object;
	};

	/**
	*  Get the original size of a bitmap
	*  @method getBitmapSize
	*  @static
	*  @param {createjs.Bitmap} bitmap The bitmap to measure
	*  @return {object} The width (w) and height (h) of the actual bitmap size
	*/
	DisplayAdapter.getBitmapSize = function(bitmap)
	{
		return {
			h: bitmap.image.height,
			w: bitmap.image.width
		};
	};

	// Assign to namespace
	namespace('cloudkid.createjs').DisplayAdapter = DisplayAdapter;

}());