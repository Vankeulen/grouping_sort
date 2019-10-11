
/** do a/b as integer division */
function over(a, b) { return Math.floor(a / b); }
/** do a%b as integer remainder */
function mod(a, b) { return Math.floor(a % b); }

// Hand-picked array
var arr = [
	14, 3, 21, 24, 8, 26, 19, 10, 2,
	25, 1, 12, 23, 13, 4, 17, 15, 20,
	9, 27, 7, 16, 18, 5, 22, 11, 6,
]

/** Do or don't print during sort operation */
var ACTUALLY_PRINT = false;


/** turn arr into a [cols * rows] matrix */
function makeMatrix(arr, rows, cols) {
	// Turn a linear array into a matrix for groupingSort
	// verify precondition on rows/cols sizes
	if (!(mod(rows, cols) === 0)) {
		throw `r % s must be 0, r=${r}, s=${s}`
	}

	const n = rows * cols;
	// Create matrix array to hold columns
	var mat = []
	// Create and fill each column with data from array
	var col = []
	for (var i = 0; i < n; i++) {
		// data is filled in column-major order
		col.push(arr[i]);

		// After the last element of the column has been added,
		if (mod(i, rows) === rows - 1) {
			// push the column into the matrix
			mat.push(col);
			// and reset the column to empty for the next column
			col = []
		}
	}

	return mat;
}

/** Turn a matrix back into a linear array */
function backIntoArray(mat) {
	// number of columns
	const s = mat.length;
	// number of rows
	const r = mat[0].length;
	// number of total elements
	const n = r * s;

	const elements = [];
	for (var i = 0; i < n; i++) { // +n+r things to do
		// Collect elements in column-major order
		elements.push(mat[over(i, r)][mod(i, r)]);
	}


	return elements;
}

/** Perform a groupingSort on  the given matrix, with a custom sort function if desired. */
function groupingSort(mat, customSort) {
	if (!customSort) {
		customSort = (a, b) => a - b;
	}

	const s = mat.length;
	const r = mat[0].length;
	const n = r * s;
	if (!(mod(r, s) === 0)) {
		var str = `r % s must be 0, r=${r}, s=${s}`
		throw str
	}

	if (ACTUALLY_PRINT) {
		console.log("initial matrix");
		printMatrix(mat)
		console.log("Step 1: Columns are sorted");
	}

	// We sort 4 times, on n/s items
	// which would be O(+4*nlog(n)) with everything else
	for (var i = 0; i < s; i++) { mat[i].sort(customSort); }
	if (ACTUALLY_PRINT) {
		printMatrix(mat)
		console.log("Step 2: transpose the matrix")
	}

	// Transposing the matrix is O(+2*n)
	transpose(mat);
	if (ACTUALLY_PRINT) {
		printMatrix(mat)
		console.log("Step 3: Columns are sorted");
	}
	for (var i = 0; i < s; i++) { mat[i].sort(customSort); }

	if (ACTUALLY_PRINT) {
		printMatrix(mat)
		console.log("Step 4: untranspose the matrix");
	}
	// Untransposing is the same amount of work as transposing, 
	// so another O(+2*n);
	untranspose(mat);

	if (ACTUALLY_PRINT) {
		printMatrix(mat);
		console.log("Step 5: Columns are sorted");
	}
	for (var i = 0; i < s; i++) { mat[i].sort(customSort); }

	if (ACTUALLY_PRINT) {
		printMatrix(mat);
		console.log("Step 6: Slide");
	}
	// O(+2*n+2*r)
	slide(mat);
	if (ACTUALLY_PRINT) {
		printMatrix(mat);
		console.log("Step 7: Columns are sorted");
	}
	// O(+(n+r)log(n+r))
	for (var i = 0; i < s; i++) { mat[i].sort(customSort); }

	if (ACTUALLY_PRINT) {
		printMatrix(mat);
		console.log("Step 8: Unslide")
	}
	// O(+2*n+2r)
	unslide(mat);

	if (ACTUALLY_PRINT) {
		printMatrix(mat);
	}

	// Big O Analysis:
	// We've done the following work:
	// Re-arranging during transpose/untranspose:
	//		2n + 2n
	// Re-arranging during slide/unslide (extra column worth of work)
	//		2n+r + 2n+r
	// Sorting 3 times:
	//		3*((n/s)log(n/s))
	// Sorting slid matrix once
	//		(n+r)log(n+r)
	// 

	// O((2+2+2+2)n +(1+1+1)*(n/s)log(n/s) + (n+r)log(n+r) + 4r)
	// worth of work -or-
	// O(8n + 3(n/s)log((n/s)) + (n+r)log((n+r)) + 4r)
	// O(n + nlog(n))
	// O(nlog(n))


}

/** Print a matrix [[],[],[]] out in row-major order (each row on a line) */
function printMatrix(mat) {
	// number of columns
	const s = mat.length;
	// number of rows
	const r = mat[0].length;
	// number of total elements
	const n = r * s;

	var str = "";
	// Print matrix out in row-major order to console
	for (var i = 0; i < n; i++) {

		var val = mat[mod(i, s)][over(i, s)];
		if (val === -Infinity) { val = "-MI" }
		else if (val === Infinity) { val = " MI" }
		str += '\t' + JSON.stringify(val);

		if (mod(i, s) === s - 1) {
			console.log(str);
			str = "";
		}
	}

}

/** transpose a matrix as described, columns become rows */
function transpose(mat) {
	// number of columns
	const s = mat.length;
	// number of rows
	const r = mat[0].length;
	// number of total elements
	const n = r * s;

	// Collect all elements in the column-major order
	const elements = []
	for (var i = 0; i < n; i++) { // +n things to do 
		// collect elements down columns...
		// first index is what column to take from (over(i,r))
		// stay on the same column till we have collected every row
		// second index is what row to take from (mod(i,r))
		// move to the next row each time
		// and back to the top after reaching the bottom
		elements.push(mat[over(i, r)][mod(i, r)]);

	}

	// Place the elements back into the matrix
	// in row-major order
	for (var i = 0; i < n; i++) { // +n things to do 
		// place elements in each column(mod(i,s))
		// move over a column each element
		// and move down a row after each column is filled (over(i,s))
		mat[mod(i, s)][over(i, s)] = elements[i];
	}

}

/** un-transpose a matrix as described, rows become columns */
function untranspose(mat) {
	// number of columns
	const s = mat.length;
	// number of rows
	const r = mat[0].length;
	// number of total elements
	const n = r * s;

	// Collect all elements in the row-major order
	const elements = []
	for (var i = 0; i < n; i++) {
		// collect elements across rows...
		// first index is what column to take from (mod(i,s))
		// move over a column each element
		// second index is what row to take from (over(i,s))
		// move down a row after each column has been collected for that row
		elements.push(mat[mod(i, s)][over(i, s)]);

	}

	// Place the elements back into the matrix
	// in column-major order
	for (var i = 0; i < n; i++) {
		// place elements in each column(mod(i,s))
		// and move down a row after each column is filled (over(i,s))
		mat[over(i, r)][mod(i, r)] = elements[i];
	}

}

/** 'slide' a matrix by adding an extra column worth of infinity values to both ends. */
function slide(mat) {
	// number of columns
	const s = mat.length;
	// number of rows
	const r = mat[0].length;
	// number of total elements
	const n = r * s;

	// Collect all elements in the column-major order
	const elements = []
	for (var i = 0; i < n; i++) { // +n things to do 
		// collect elements down columns...
		// first index is what column to take from (over(i,r))
		// stay on the same column till we have collected every row
		// second index is what row to take from (mod(i,r))
		// move to the next row each time
		// and back to the top after reaching the bottom
		elements.push(mat[over(i, r)][mod(i, r)]);
	}

	// +r things to do

	// Add rows / 2 '-infinity's at the begining of data
	for (var i = 0; i < over(r, 2); i++) {
		elements.unshift(-Infinity);
	}

	// Add rows / 2 '+infinity's at the end of data
	for (var i = 0; i < over(r, 2); i++) {
		elements.push(Infinity);
	}
	// If we have an odd number of rows, add an extra on the +infinity end
	if (mod(r, 2) === 1) {
		elements.push(Infinity);
	}

	// Add extra column to matrix
	const col = [];
	for (var i = 0; i < r; i++) { col[i] = 0; }
	mat.push(col);


	// Const for number of columns after having added one.
	// const s2 = s+1;
	// n2 is the number of elements after having added one column.
	const n2 = n + r;
	for (var i = 0; i < n2; i++) { // +n+r things to do
		// Fill elements back in column major order
		// first index is column to add to
		// second index is what row to add to
		mat[over(i, r)][mod(i, r)] = elements[i];
	}

}

/** 'unslide' a matrix by removing an extra column worth of infinity values from both ends. */
function unslide(mat) {
	// number of columns, 
	// in this case, plus 1 from the actual starting matrix
	const s2 = mat.length;
	// actual number of columns.
	const s = s2 - 1;
	// number of rows
	const r = mat[0].length;
	// number of total elements, with extra column
	const n2 = r * s2;
	// actual number of elements
	const n = n2 - r;

	const elements = [];
	for (var i = 0; i < n2; i++) { // +n+r things to do
		// Collect elements in column-major order
		elements.push(mat[over(i, r)][mod(i, r)]);
	}

	// +r things to do to remove that row

	// Discard one row worth of elements,
	// half from the begining, 
	for (var i = 0; i < over(r, 2); i++) {
		elements.shift();
	}

	// half from the end.
	for (var i = 0; i < over(r, 2); i++) {
		elements.pop();
	}
	// Plus an extra if we have an odd number of rows
	if (mod(r, 2) === 1) {
		elements.pop();
	}


	// console.log(elements);
	// discard last column from matrix
	mat.pop();
	for (var i = 0; i < n; i++) { // +r things to do
		mat[over(i, r)][mod(i, r)] = elements[i];
	}

}

/** check if an array is sorted by a given sort, throw if an out of order element is detected  */
function checkIsSorted(arr, customSort) {
	if (!customSort) { customSort = (a, b) => a - b; }
	for (var i = 1; i < arr.length; i++) {
		if (arr[i - 1] > arr[i]) {
			var str = `Out of order at ${i - 1}=${arr[i - 1]}, ${i}=${arr[i]}`
			throw str
		}
	}
}

/** Generate a random sequence of length elements, from [min, max) */
function randomSequence(length, min, max) {
	const arr = []
	for (var i = 0; i < length; i++) {
		arr.push(Math.floor(min + Math.random() * (max - min)))
	}
	return arr;
}


ACTUALLY_PRINT = true;
var mat = makeMatrix(arr, 9, 3)
groupingSort(mat);

var sorted = backIntoArray(mat);
checkIsSorted(sorted);


ACTUALLY_PRINT = false;

// Loop a bunch of times to test larger matricies being sorted 
for (var i = 0; i < 10; i++) {
	var arr2 = randomSequence(7 * 140, -9999999, 9999999)
	mat = makeMatrix(arr2, 140, 7)
	groupingSort(mat);
	sorted = backIntoArray(mat);
	//console.log(sorted);

	try {
		checkIsSorted(sorted);
	} catch (err) { console.log(err); }
}

// Create a sequence, by pigeonhole principle, we will have duplicate values in the sequence (27 values from 1 to 10)
var seq = randomSequence(3 * 9, 1, 10)
// Map those values to an object with the value assigned to a field 
var objs = seq.map(it => { return { value: it }; });
// Assign each object it's original index in the array. 
for (var i = 0; i < objs.length; i++) { objs[i].index = i; }

/** Compare two 'objects' (or infinity values) */
function compareObjects(a, b) {
	var aval, bval;
	if (a === Infinity) { aval = Infinity; }
	else if (a === -Infinity) { aval = -Infinity; }
	else { aval = a.value; }

	if (b === Infinity) { bval = Infinity; }
	else if (b === -Infinity) { bval = -Infinity; }
	else { bval = b.value; }

	return aval - bval;
}

/** Check if an array of objects is stable with a previous state 
by comparing original indexes of consecutive equal-valued objects */
function checkIsStable(arr) {
	for (var i = 1; i < arr.length; i++) {
		var prev = arr[i - 1];
		var now = arr[i];
		if (compareObjects(prev, now) === 0) {
			// Compare ORIGINAL index for equal objects
			if (prev.index > now.index) {
				throw "Not stable"
			}
		}
	}
}

var objMat = makeMatrix(objs, 9, 3)
groupingSort(objMat, compareObjects);

console.log("Printing object matrix:");
printMatrix(objMat);

var sortedObjects = backIntoArray(objMat);
try {
	checkIsSorted(sortedObjects, compareObjects);
	checkIsStable(sortedObjects, compareObjects);
} catch (err) { console.log(err); }
