
var rect=require('./rectangle');

function solveRect(l,b){
	console.log('solving for rectangle with l='+l+" b="+b);

	rect(l,b,(err,rectangle)=>{
		if(err){
			console.log('Error',err.message);
		}
		else{
			console.log("area is ",rectangle.area());// no params cz l,b have been passed in line 7, closure prop
			console.log('perimeter is ',rectangle.perimeter());
		}
	});/// this part executed after a 2 second delay
	console.log('this statement is after the call to rect()'); // async execution, during the 2 sec delay- itis printed 
}
solveRect(2,4);
solveRect(0,4);
