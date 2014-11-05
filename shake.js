(function() {
	function addLog(delta, d){
		var p = document.createElement('p')
		p.innerHTML = "delta:" + delta + ", d:" + d
		document.getElementById('log').insertBefore(p,document.getElementById('log').firstChild)
	}
	if('ondevicemotion' in window) {
		var lastXYZ = {}, // 上一次devicemotion的3个方向的加速度
			threshold = 15, // 临界值，变化量绝对值需要大于临界值 
			lastTime = Date.now(), // 上一次devicemotion时间
			dictionary = {
				'x': 'leftright',
				'y': 'forwardback',
				'z': 'updown',
				'-x': 'left',
				'+x': 'right',
				'-y': 'back',
				'+y': 'forward',
				'-z': 'down',
				'+z': 'up' 
			}
		function outLimit(x, y, z) {
			var ax = Math.abs(x),
				ay = Math.abs(y),
				az = Math.abs(z),
				max = Math.max(ax, ay, az)
			if(max < threshold) return false
			if(max === ax) return 'x'
			if(max === ay) return 'y'
			if(max === az) return 'z'
		}
		avalon.eventHooks.shake = {
			type: 'devicemotion',
	        deel: function(elem, fn) {
	            return function(e) {
	            	var nowXYZ = e.accelerationIncludingGravity, // 重力加速度
	            		now, // 当前时间
	            		pastTime, // 距离上次devicemotion间隔时间
	            		direction // 最大增量方向
	            	nowXYZ.z = nowXYZ.z - 9.8 // 忽略重力加速度的Z
	            	if(lastXYZ.x === null && lastXYZ.y === null && lastXYZ.z === null) {
	            		lastXYZ = {
	            			x: nowXYZ.x,
	            			y: nowXYZ.y,
	            			z: ignoreGravityZ
	            		}
	            		return
	            	}
	            	direction = outLimit(nowXYZ.x - lastXYZ.x, nowXYZ.y - lastXYZ.y, nowXYZ.z - lastXYZ.z)
	            	if(direction) {
	            		now = Date.now()
	            		pastTime = now - lastTime
	            		// 触发间隔，> 1s触发一次
	            		if(pastTime > 1000) {
	            			// else 双向
	            			// 单向
	            			if(lastXYZ[direction] * nowXYZ[direction] < 0) {
	            				direction = (lastXYZ[direction] < 0 ? '-' : '+') + direction
	            			}
            				addLog(nowXYZ[direction] - lastXYZ[direction], dictionary[direction])
	            			fn(e)
	            			lastTime = Date.now()
	            		}
	            	}
	            	lastXYZ = {
            			x: nowXYZ.x,
            			y: nowXYZ.y,
            			z: nowXYZ.z
            		}
	            }
	        }
		}
	}
}) ()
