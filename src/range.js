export function myRange(start,stop,step) {
	if (stop == null) {
		stop  = start;
		start = 0;
	}
	if (!step) {
		step = 1;
	}
	const len = (stop - start) / step;
	return new Proxy({length: len}, {
		get: (t, prop) => { 
			return prop === 'length' ? t.length : 
						 prop < t.length   ? start + (prop * step) : undefined;
		}
	});	
}
