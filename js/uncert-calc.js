const numItems = ["0","1","2","3","4","5","6","7","8","9","."]
const operators = ["+","-","*","/","^"]
const otherItems = ["(",")","a","b"]
const termItems = [...numItems,...operators,...otherItems];
const termsAndService = [
    "not whine when the calculator is wrong but rather tell me what's wrong",
    "not use this tool to create weapons of mass destruction",
    "buy me jello :3",
    "give me a crisp high-five next time on the hallway",
    "share this with your friends!"
]
const precedence = {
    "^": 3,
    "/": 2,
    "*": 2,
    "+": 1,
    "-": 1
}


var uncert1 = [];
var uncert2 = [];
var terms = [];

submitEquation = function(){
    uncert1 = [];
    uncert2 = [];
    terms = [];
    skip = 0;
    uncert1 = [document.getElementById("uncert-1").value,document.getElementById("uncert-1u").value];
    uncert2 = [document.getElementById("uncert-2").value,document.getElementById("uncert-2u").value];
    terms = (document.getElementById("uncert-equation").value).toLowerCase().split("");
    

    var test = 0
    if(test==1){
        uncert1 = ["7412.53125", "12"]
        uncert2 = ["0", "0"]
        terms = ["a"]
    }else if(test==2){
        uncert1 = ["12345678.90", "3512.35"]
        uncert2 = ["0", "0"]
        terms = ["a", "+", "2"]
    }else if(test==3){
        uncert1 = ["1.0", "0.1"]
        uncert2 = ["15.0", "0.1"]
        terms = ["(","a", "+", "b",")"]
    }else if(test==4){
        uncert1 = ["0.29", "0.10"]
        uncert2 = ["", ""]
        terms = ["(","a",")"]
    }else if(test==5){
        uncert1 = ["74000", "315.126317"]
        uncert2 = ["1634", "2.1"]
        terms = ["(","a","(","a","+","b","+","a",")","/","b",")","7",".","4","^","2","5",".","2","1"]
    }//Values: 333006535.3311124 -> 330000000
    //Uncertainty: 3248468.4798105145 -> 3200000



    terms.unshift("(")
    terms.push(")")

    clearOutput()
    reducesigfigs(revpol(uncert(shuntingyard(evaluateFunction(terms)))))
    //var final = chopValue(rounding(solveFunction(evaluateFunction())))
    //showResult(final)
}

function clearOutput(){
    var outputArea = document.getElementById("outputArea")
    if (outputArea!=null){
        outputArea.parentNode.removeChild(outputArea);
    }
    var outputArea = document.createElement("div")
    outputArea = document.createElement("div")
    
    outputArea.id="outputArea"
    
    document.getElementById("output").appendChild(outputArea)
    var nextLine = document.createElement("hr")
    nextLine.setAttribute("noshade",true)
    outputArea.appendChild(nextLine)
}

function evaluateFunction(terms){
    final = []
    temp = []
    brackets = terms.toString().split(")").length-terms.toString().split("(").length
    while(brackets>0){
        terms.unshift("(")
        brackets--
    }
    while(brackets<0){
        terms.push(")")
        brackets++
    }

    terms.forEach((term, i) => {
        if (numItems.includes(term)){
            //pushes possibly conjoined terms to temp
            temp.push(term)
        }else if(term=="-"&&(temp.length==0&&(["*","/","^","("].includes(final[final.length-1])&&(["a","b"].includes(terms[i+1])||!isNaN(terms[i+1])))||final.length==0)){
            // -5->"-5"
            temp.push(term)
        }else{//pushes non-conjoined terms to final after pushes contents of temp
            if(temp.length!=0){
                //a1.5 -> a * 1.5. etc
                if([")","a","b"].includes(final[final.length-1])){
                    final.push("*")
                }
                final.push(temp.join(""))
                temp = []
            }
            //ab -> a * b. etc
            if(((["(","a","b"].includes(term.toLowerCase()))||!isNaN(term))&&([")","a","b"].includes(final[final.length-1])||!isNaN(final[final.length-1]))){
                final.push("*")
            }
            final.push(term.toLowerCase())
        }
    });
    //pushes contents of temp if present
    if(temp.length!=0){
        final.push(temp.join(""))
        temp = []
    }
    return final

}

function shuntingyard(terms){
    output = []
    operator = []
    terms.forEach(term => {
        if(!isNaN(term)||term=="a"||term=="b"){
            output.push(term)
        }else if(operators.includes(term)){
            //if operator at the top of operator stack has greter precedence, or (operator at top has equal precedence and token is left associative) and operator at top of operator stack is not (:
            while(operator.length!=0 && (precedence[operator[operator.length-1]]>=precedence[term])&&operator[operator.length-1]!="("){
                output.push(operator.pop())
            }
            operator.push(term)
        }else if(term=="("){
            operator.push(term)
        }else if(term==")"){
            while(operator[operator.length-1]!="("){
                output.push(operator.pop())
            }
            if(operator[-1]!=")"){
                operator.pop()
            }
            
        }
    });
    while(operator.length!=0){
        output.push(operator.pop())
    }
    return output
}

function uncert(terms){
    final=[]
    terms.forEach(term => {
        if(["a","b"].includes(term)||!isNaN(term)){
            //if term, replace with uncertainty
            if(term=="a"){
                final.push(uncert1)
            }else if(term=="b"){
                final.push(uncert2)
            }else{
                final.push([term,"0"])
            }
        }else{
            //if not term skip
            final.push(["operator",term])
        }
    });
    return final
}

function displayStep(title,subtext){
    var heading = document.createElement("h3")
    heading.innerHTML=(title).toString()
    outputArea.appendChild(heading)
    var desc = document.createElement("p")
    desc.innerHTML=(subtext).toString()
    outputArea.appendChild(desc)
}

function revpol(terms){
    index=0
    while(terms.length!=1){
        if(terms[index][0]!="operator"&&terms[index+1][0]!="operator"&&terms[index+2][0]=="operator"){
            term1=terms[index]
            term2=terms[index+1]
            operator=terms[index+2][1]
            
            
            switch (operator){
                case "+":
                    result = [(parseFloat(term1[0])+parseFloat(term2[0])).toString(),(parseFloat(term1[1])+parseFloat(term2[1])).toString()]
                    var title = "Addition: Add both the values and uncertainties."
                    var text = `Values: ${term1[0]} + ${term2[0]} = ${result[0]}<br>
                    Uncertainty: ${term1[1]} + ${term2[1]} = ${result[1]}<br>`
                    displayStep(title,text);
                    break;
                case "-":
                    result = [(parseFloat(term1[0])-parseFloat(term2[0])).toString(),(parseFloat(term1[1])+parseFloat(term2[1])).toString()]
                    var title = "Subtraction: Subtract the values, but add the uncertainties."
                    var text = `Values: ${term1[0]} - ${term2[0]} = ${result[0]}<br>
                    Uncertainty: ${term1[1]} + ${term2[1]} = ${result[1]}<br>`
                    displayStep(title,text);
                    break;
                case "*":
                    res = parseFloat(term1[0])*parseFloat(term2[0])
                    result = [res.toString(),(res*(parseFloat(term1[1])/parseFloat(term1[0])+parseFloat(term2[1])/parseFloat(term2[0]))).toString()]
                    var title = "Multiplication: Multiply the values, add percent uncertainties. Convert back to absolute unceratinty."
                    var text = `Values: ${term1[0]} * ${term2[0]} = ${result[0]}<br>
                    Uncertainty: ${result[0]} * ( ${term1[1]} / ${term1[0]} + ${term2[1]} / ${term2[0]} ) = ${result[1]}<br>`
                    displayStep(title,text);
                    break;
                case "/":
                    res = parseFloat(term1[0])/parseFloat(term2[0])
                    result = [res.toString(),(res*(parseFloat(term1[1])/parseFloat(term1[0])+parseFloat(term2[1])/parseFloat(term2[0]))).toString()]
                    var title = "Division: Divide the values, add percent uncertainties. Convert back to absolute unceratinty."
                    var text = `Values: ${term1[0]} / ${term2[0]} = ${result[0]}<br>
                    Uncertainty: ${result[0]} * ( ${term1[1]} / ${term1[0]} + ${term2[1]} / ${term2[0]} ) = ${result[1]}<br>`
                    displayStep(title,text);
                    break;
                case "^":
                    if(term1[1]=="0"&&term2[1]=="0"){
                        result = [parseFloat(term1[0])**parseFloat(term2[0]).toString(),"0"]
                        var title = "Exponentation: Well I hope you can do this"
                        var text = `Values: ${term1[0]} ^ ${term2[0]} = ${result[0]}<br>
                        Uncertainty: 0<br>`
                        displayStep(title,text);
                        break;
                    }else if(term1[1]!="0"&&term2[1]=="0"){
                        res = parseFloat(term1[0])**parseFloat(term2[0])
                        result = [res.toString(),(res*(parseFloat(term2[0])*parseFloat(term1[1])/parseFloat(term1[0]))).toString()]
                        var title = `Exponentation: Multiply percent uncertainty ${term2[0]} times.`
                        var text = `Values: ${term1[0]} ^ ${term2[0]} = ${result[0]}<br>
                        Uncertainty: ${result[0]} * ( ${term2[0]} * ( ${term2[1]} / ${term2[0]} ) ) = ${result[1]}<br>`
                        displayStep(title,text);
                        break;
                    }else if(term1[1]=="0"&&term2[1]!="0"){
                        res = parseFloat(term1[0])**parseFloat(term2[0])
                        a = term1[0]
                        b = term2[0]
                        ua = term1[1]/a
                        ub = term2[1]/b

                        result = [res.toString(),((((b*(a**(b-1))*ua)**2)+((a**b)*Math.log(a)*ub)**2)**0.5).toString()]
                        var title = `Exponentation: I'm not really sure, I just asked my physics teacher.`
                        var text = `Values: ${term1[0]} ^ ${term2[0]} = ${result[0]}<br>
                        Uncertainty: I honestly don't know lol = ${result[1]}<br>`
                        displayStep(title,text);
                        break;                        
                    }else if(term1[1]!="0"&&term2[1]!="0"){
                        res = parseFloat(term1[0])**parseFloat(term2[0])

                        result = [res.toString(),((((b*(a**(b-1))*ua)**2)+((a**b)*Math.log(a)*ub)**2)**0.5).toString()]
                        var title = `Exponentation: This calculator doesn't support this.`
                        var text = `Values: ${term1[0]} ^ ${term2[0]} = ${result[0]}<br>
                        Uncertainty: error<br>`
                        displayStep(title,text);
                        break;           
                    }


                    
            }
            terms.splice(index,1)
            terms.splice(index,1)
            terms[index] = result
            

        }
        else{
            index++
        }
        if(index>=terms.length-2){
            index = 0
            opcount = 0
            termcount = 0
            terms.forEach(term => {
                if(term[0]=="operator"){
                    opcount++
                }else{
                    termcount++
                }
            });

            if(opcount>termcount*3){
                return "error"
            }else if(!(termcount==1&&opcount==0)&&(termcount<=2&&opcount!=1||termcount==1&&opcount==1)){
                return "error"
            }





        }

    }
    return terms[0]
    
}

function sigfigs(value){
    sigfig = value.length
    if(value.includes('.')){
        sigfig--
    }else{
        value = parseFloat(value)
        while(value%10==0&&value!=0){
            sigfig--
            value=value/10
        }
    }
    return sigfig
}

function reducesigfigs(result){
    if(result=="error"){
        var title = `ERROR`
        var text = `Unmatched operator error`
        displayStep(title,text);
        return "error"
    }
    minfigs = sigfigs(uncert1[0])
    if(minfigs>sigfigs(uncert2[0])&&sigfigs(uncert2[0])!=0){
        minfigs = sigfigs(uncert2[0])
    }

    final = convertthencut(result,minfigs)

    if(Math.abs(final[0])<10**5){
        final = [parseFloat(final[0]).toString(),parseFloat(final[1]).toString()]
    }


    var title = `Round to ${minfigs} sig figs, match uncertainty with value.`
    var text = `Values: ${result[0]} -> ${final[0]}<br>
    Uncertainty: ${result[1]} -> ${final[1]}<br>`
    displayStep(title,text);

    var title = `Final Value:`
    var text = `${final[0]}±${final[1]}<br>`
    displayStep(title,text);


    
    function convertthencut(values,figs){
        splitvalue = [parseFloat(values[0]).toExponential().split("e"),parseFloat(values[1]).toExponential().split("e")]
        if(figs==1){
            figs++
        }if(figs<1){
            figs=1
        }
        return [parseFloat(splitvalue[0][0]).toFixed(figs-1)+"e"+splitvalue[0][1],(parseInt(splitvalue[1][0])/10**(parseInt(splitvalue[0][1])-parseInt(splitvalue[1][1]))+5*10**(-figs)).toFixed(figs-1)+"e"+splitvalue[0][1]]
    }
}