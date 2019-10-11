Grouping Sort

Grouping sort works when there are N values placed in a RxS matrix where N == RxS, R is divisible by S (that is R % S = 0), and R >= 2(S-1)(S-1).

After Grouping Sort runs, the matrix will have the values sorted when accessed from the first column to the Nth column (called column-major order).
The Algorithm
This is an 8-step algorithm. The columns are sorted in steps 1,3,5 & 7 and the data is rearranged in steps 2, 4, 6 & 8 as follows:

    Step 2: Transpose - Access the values in column-major order and return them to the matrix in row-major order.
    Step 4: Un-Transpose - Access the values in row-major order and return them to the matrix in column-major order.
    Step 6: Slide - In a column-major order sense, slide the data forward by floor(R/2) positions. This creates an extra column. Fill the emptied positions in the first column with -MAXINT and the unused positions in the new column with MAXINT.
    Step 8: Unslide - Slide all values back (undo step 6) eliminating the extra column and the -MAXINT and MAXINT values. 

Example
Assume N=27, R=9 and S=3. The matrix is initialized as follows:

	14	25	 9
	 3	 1	27
	21	12	 7
	24	23	16
	 8	13	18
	26	 4	 5
	19	17	22
	10	15	11
	 2	20	 6
	

Step 1: The columns are sorted

	 2	 1	 5
	 3	 4	 6
	 8	12	 7
	10	13	 9
	14	15	11
	19	17	16
	21	20	18
	24	23	22
	26	25	27
	

Step 2: Transpose the Matrix

	 2	 3	 8
	10	14	19
	21	24	26
	 1	 4	12
	13	15	17
	20	23	25
	 5	 6	 7
	 9	11	16
	18	22	27
	

Step 3: The columns are sorted

	 1	 3	 7
	 2	 4	 8
	 5	 6	12
	 9	11	16
	10	14	17
	13	15	19
	18	22	25
	20	23	26
	21	24	27
	

Step 4: Un-transpose

	 1	 9	18
	 3	11	22
	 7	16	25
	 2	10	20
	 4	14	23
	 8	17	26
	 5	13	21
	 6	15	24
	12	19	27
	

Step 5: The columns are sorted

	 1	 9	18
	 2	10	20
	 3	11	21
	 4	13	22
	 5	14	23
	 6	15	24
	 7	16	25
	 8	17	26
	12	19	27
	

Step 6: Slide
MI stands for MaxInt

	-MI	 6	15	24
	-MI	 7	16	25
	-MI	 8	17	26
	-MI	12	19	27
	  1	 9	18	MI
	  2	10	20	MI
	  3	11	21	MI
	  4	13	22	MI
	  5	14	23	MI
	

Step 7: The columns are sorted

	-MI	 6	15	24
	-MI	 7	16	25
	-MI	 8	17	26
	-MI	 9	18	27
	  1	10	19	MI
	  2	11	20	MI
	  3	12	21	MI
	  4	13	22	MI
	  5	14	23	MI
	

Step 8: Unslide

	 1	10	19	
	 2	11	20
	 3	12	21	
	 4	13	22
	 5	14	23
	 6	15	24
	 7	16	25
	 8	17	26
	 9	18	27
	