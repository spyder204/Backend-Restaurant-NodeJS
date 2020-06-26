module.exports=(x,y, callback)=>{
	if(x<=0 || y<=0){
		setTimeout(()=> callback(new Error('invalid dimensions'),null) , 2000);  //delayed by 2000 ms
		//CB is going to return an error as the first param, second param is ignored ny putting null
		//console.log('invalid dimensions');
	}
	
	else{
		setTimeout(()=>
			callback(null,
				{ perimeter:()=>(2*(x+y)),
 				   area:()=>(x*y)  // no need to write x,y in params cz they have been already passed in line 1; closure prop of functions				  
 				}),

 				2000); // error is set to null


	}
}



