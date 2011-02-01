$(function () {
	$.svg.addExtension('ext', SVGExt)

	$('body').svg(function(svg) {
		var defs = svg.defs(),
			strokeColor = 'url(#stroke)',
			fillColor = 'url(#fill)',
			highlightColor = 'url(#highlight)',
			specularColor = 'url(#specular)',
			width = this.clientWidth,
			height = this.clientHeight
		
		var shadow = svg.filter(defs, 'shadow')
		svg.filters.gaussianBlur(shadow, 'blur', 'SourceAlpha', 5)
	
		var blur = svg.filter(defs, 'blur')
		svg.filters.gaussianBlur(blur, 'dizzy', 'SourceGraphic', 3)

		svg.linearGradient(defs, 'stroke', [[0, '#f5871f'], [1, '#d86f0b']], 0, 0, 1, 1)
		svg.linearGradient(defs, 'fill', [[0, '#feeddb'], [1, '#f7931d']], 0, 0, .5, .5)
		svg.linearGradient(defs, 'highlight', [[0, '#fff'], [1, '#f7931d']], 0, 0, 1, 1)
		svg.linearGradient(defs, 'specular', [[0, '#f7931d'], [1, '#fff']], 0, 0, .5, .5)

		svg.linearGradient(defs, 'stroke2', [[0, '#82a5d2'], [1, '#658DC2']], 0, 0, 1, 1)
		svg.linearGradient(defs, 'fill2', [[0, '#80a3d2'], [1, '#8BADD9']], 0, 0, .5, .5)
		svg.linearGradient(defs, 'highlight2', [[0, '#fff'], [1, '#8BADD9']], 0, 0, 1, 1)
		svg.linearGradient(defs, 'specular2', [[0, '#8BADD9'], [1, '#fff']], 0, 0, .5, .5)

		var logo = svg.group('meebo', {transform: 'translate(' + [width / 2, height / 2 - 100].join(',') + ')'})
		
		// Large circle
		var largeMask = svg.mask(defs, 'large')
		svg.ext.ring(largeMask, -5, -5, 95, 145, {fill: '#fff'})	

		var large = svg.group(logo, '', {transform: 'scale(1)'})
		svg.ext.ring(large, 0, 0, 85, 155, {stroke: '#000', filter: 'url(#shadow)', opacity: .3})	
		svg.ext.ring(large, 0, 0, 85, 155, {fill: strokeColor})
		svg.ext.ring(large, -2, -2, 95, 145, {fill: highlightColor, mask: 'url(#large)'})
		svg.ext.ring(large, 2, 2, 96, 144, {fill: fillColor, mask: 'url(#large)'})
		svg.circle(large, -100, -100, 180, {fill: specularColor, mask: 'url(#large)', opacity: .3})
		
		// Medium circle
		var mediumMask = svg.mask(defs, 'medium')
		svg.circle(mediumMask, -3, -3, 45, {fill: '#fff'})
		
		var medium = svg.group(logo, '', {transform: 'translate(-55, 215)'})
		medium = svg.group(medium, '', {transform: 'scale(1)'})
		svg.circle(medium, 0, 0, 50, {filter: 'url(#shadow)', opacity: .3})
		svg.circle(medium, 0, 0, 50, {fill: strokeColor})
		svg.circle(medium, -1, -1, 45, {fill: highlightColor, mask: 'url(#medium)'})
		svg.circle(medium, 1, 1, 44, {fill: fillColor, mask: 'url(#medium)'})
		svg.circle(medium, -40, -40, 50, {fill: specularColor, mask: 'url(#medium)', opacity: .3})
		
		// Small circle
		var smallMask = svg.mask(defs, 'small')
		svg.circle(smallMask, -2, -2, 20, {fill: '#fff'})
		
		var small = svg.group(logo, '', {transform: 'translate(-110, 300)'})
		small = svg.group(small, '', {transform: 'scale(1)'})
		svg.circle(small, 0, 0, 25, {filter: 'url(#shadow)', opacity: .3})
		svg.circle(small, 0, 0, 25, {fill: strokeColor})
		svg.circle(small, -1, -1, 20, {fill: highlightColor, mask: 'url(#small)'})
		svg.circle(small, 1, 1, 19, {fill: fillColor, mask: 'url(#small)'})
		svg.circle(small, -20, -20, 25, {fill: specularColor, mask: 'url(#small)', opacity: .3})

		// Fun interactions
		$(large).click((function(elements) {
			return function(evt, index) {
				var fn = arguments.callee, index = index || 0
				$(elements[index]).animate({svgTransform: 'scale(.75)'}, 'fast')
						.animate({svgTransform: 'scale(1)'}, 'fast', function() {
							if (index + 1 < elements.length) {
								fn(evt, index + 1)
							}
						})
			}
		})([large, medium, small])).css('cursor', 'pointer')
		
		$(medium).mouseover(function() {
			svg.change(logo, {filter: 'url(#blur)'})
		}).mouseout(function() {
			svg.change(logo, {filter: null})
		})
		
		$(small).click(function() {
			$(logo).animate({svgTransform: 'translate(' + [width / 2, height / 2].join(',') + ') skewX(-30) rotate(90)'})
		})
		
		// Adjust when window resizes
		$(window).resize(function() { 
			var body = document.body,
				width = body.clientWidth,
				height = body.clientHeight

			svg.configure({width: width, height: height})
			svg.change(logo, {transform: 'translate(' + [width / 2, height / 2 - 100].join(',') + ')'})
		})
		$(window).resize()
	})
})

$.extend($.svg._wrapperClass.prototype, {ext: function() {}})

SVGExt = function(wrapper) {
	this._wrapper = wrapper; // The attached SVG wrapper object
	this.ring = function(parent, x, y, innerRadius, outerRadius, settings) {
		var args = this._wrapper._args(arguments, ['x', 'y', 'innerRadius', 'outerRadius'])
		return this._wrapper.path(
			args.parent,
			this._wrapper.createPath()
				.move(args.x - args.innerRadius, args.y)
				.arc(args.innerRadius, args.innerRadius, 0, 1, 0, args.x - args.innerRadius, args.y - 0.1)
				.close()
				.move(args.x - args.outerRadius, args.y)
				.arc(args.outerRadius, args.outerRadius, 0, 1, 0, args.x - args.outerRadius, args.y - 0.1)
				.close(),
			$.extend({fillRule: 'evenodd'}, args.settings || {})
		)
	}
}
