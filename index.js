import {db} from './config.js'
(function init(){
    function keyEventBinder(key,btn){
        window.addEventListener('keyup',(e)=>{
            if (e.key==key && key!='='){
                btn.click();

            }
        })

    }
    let rows=document.getElementsByClassName("row");
    function getInput(){
        let input=document.getElementById("input").innerHTML.trim();
        return input;
    }
    let calcstr='',firing=false,displaystr='';
    async function evalcalcStr(){
        let str='';
        let total=0;
        let operations=[];
        
        for (let nos of calcstr){
            if (['+','-','*','/','=','l','E','S','C'].includes(nos)==false){
                str+=nos;
                
            }
            else{
                operations.push(str);
                operations.push(nos);
                str='';
            }
        }
        
        if ((operations.length)==4){
            let lastoperator=operations[3];
            operations.splice(3,1);
                
            if (operations[1]=='+'){
                total=parseInt(operations[0])+parseInt(operations[2]);
                if (operations[0].includes('.') || operations[2].includes('.')){
                    total=parseFloat(operations[0])+parseFloat(operations[2]);
                }
            }
            else if (operations[1]=='-'){
                total=parseInt(operations[0])-parseInt(operations[2]);
                if (operations[0].includes('.') || operations[2].includes('.')){
                    total=parseFloat(operations[0])-parseFloat(operations[2]);
                }
            }
            else if (operations[1]=='*'){
                total=parseInt(operations[0])*parseInt(operations[2]);
                if (operations[0].includes('.') || operations[2].includes('.')){
                    total=parseFloat(operations[0])*parseFloat(operations[2]);
                }
            }
            else if (operations[1]=='/'){
                total=parseInt(operations[0])/parseInt(operations[2]);
                if (operations[0].includes('.') || operations[2].includes('.')){
                    total=parseFloat(operations[0])/parseFloat(operations[2]);
                }
            }
            else if (operations.includes('l')){
                total=Math.log10(operations[(operations.indexOf('l'))-1]);
                if (operations[0].includes('.') || operations[1].includes('.')){
                    total=Math.log10(parseFloat(operations[(operations.indexOf('l'))-1]))
                }

            }
            else if (operations.includes('C')){
                total=Math.cos(operations[(operations.indexOf('C'))-1]);
                if (operations[0].includes('.') || operations[1].includes('.')){
                    total=Math.cos(parseFloat(operations[(operations.indexOf('C'))-1]))
                }

            }
            else if (operations.includes('S')){
                total=Math.sin(operations[(operations.indexOf('S'))-1]);
                if (operations[0].includes('.') || operations[1].includes('.')){
                    total=Math.sin(parseFloat(operations[(operations.indexOf('S'))-1]))
                }

            }
            else if (operations[1]=='E'){
                total=parseInt(operations[0])**parseInt(operations[2]);
                if (operations[0].includes('.') || operations[2].includes('.')){
                    total=parseFloat(operations[0])**parseFloat(operations[2]);
                }
                
            }
            else if (operations[1]=='='){
                total=parseInt(operations[0]);
                if (operations[0].includes('.')){
                    total=parseFloat(operations[0]);
                }
            }
            if (total.toString().includes('.')==false){
                document.getElementById("input").innerText=total.toString();
                displaystr=''
                for (let chars in calcstr){
                    displaystr+=calcstr[chars];
                    if (['l','E','S','C'].includes(calcstr[chars])){
                        if (calcstr[chars]=='l'){
                            displaystr+='log10';
                        }
                        else if (calcstr[chars]=='E'){
                            displaystr+='Exp'
                        }
                        else if (calcstr[chars]=='S'){
                            displaystr+="Sin"
                        }
                        else if (calcstr[chars]=='C'){
                            displaystr+='Cos';
                        }
                    }
                }
                document.getElementById("displaystr").value=displaystr.slice(0,displaystr.length - 1)+"="+total.toString()+';';
                calcstr=total.toString()+lastoperator;
                await db.collection("users").doc("user1").get().then(async res =>{
                    let data=await res.data();
                    if (data.calctext==''){
                        await db.collection("users").doc("user1").set({calctext:document.getElementById("displaystr").value});
                    }else{
                        let existing=data.calctext;
                        existing=existing+document.getElementById("displaystr").value
                        await db.collection("users").doc("user1").set({calctext:existing});
                    }
                })
                
            }else{
                document.getElementById("input").innerText=total.toFixed(4);
                displaystr=''
                for (let chars in calcstr){
                    displaystr+=calcstr[chars];
                    if (['l','E','S','C'].includes(calcstr[chars])){
                        if (calcstr[chars]=='l'){
                            displaystr+='log10';
                        }
                        else if (calcstr[chars]=='E'){
                            displaystr+='Exp'
                        }
                        else if (calcstr[chars]=='S'){
                            displaystr+="Sin"
                        }
                        else if (calcstr[chars]=='C'){
                            displaystr+='Cos';
                        }
                    }
                }
                document.getElementById("displaystr").value=displaystr+total.toFixed(4)+';';
                await db.collection("users").doc("user1").get().then(async res =>{
                    let data=await res.data();
                    if (data.calctext==''){
                        await db.collection("users").doc("user1").set({calctext:document.getElementById("displaystr").value});
                    }else{
                        await db.collection("users").doc("user1").set({calctext:data.calctext+document.getElementById("displaystr").value});
                    }
                })
                calcstr=total.toFixed(4)+lastoperator;
            }
           

            
        }

    }
    
   
    for (let k of rows){
        for (let child of k.childNodes){
            if(child.classList!=undefined){
                if (['+','-','*','/','=','log10','Exp','Sin','Cos','C','Del'].includes(child.innerText)==false){
                    child.onclick=function(){
                        if (firing){
                            document.getElementById("input").innerHTML='';
                            firing=false;
                        }
                        if (getInput()=='0'){
                            document.getElementById("input").innerHTML=child.innerText;
                        }else{
                            document.getElementById("input").innerHTML+=child.innerText;
                        }
                    }
                    keyEventBinder(child.innerText,child)
                }
                else{
                    //console.log(child.innerText,child)
                    if (child.getAttribute("class")!='spl' && child.innerText!='='){
                        child.onclick=function(){
                            calcstr+=(getInput()+child.innerText);
                            evalcalcStr();
                            if (child.innerText!='.'){
                                firing=true;
                            }

                            
                        }
                        keyEventBinder(child.innerText,child)
                    }
                    else if (child.innerText=='='){
                        child.onclick=function(){
                            calcstr+=(getInput()+child.innerText);
                            evalcalcStr();
                            if (child.innerText!='.'){
                                firing=true;
                            }
                        }
                        window.addEventListener('keyup',(e)=>{
                            if (e.key=="Enter"){
                                child.click();
                            }
                        })
                    }
                    
                        
                        
                    
                    
                }
                
            }
        }
    }
    let spl=document.getElementsByClassName("spl");
    for (let m of spl){
        m.onclick=function(){
            if (m.innerText!='Exp'){
                m.click();
            }
            calcstr+=(getInput()+m.innerText[0]);
            evalcalcStr();
            if (m.innerText!='.'){
                firing=true;
            }
        }
    }
    document.getElementById("c").onclick=function(){
        document.getElementById("input").innerText='0';
        calcstr='';
    }
    document.getElementById("del").onclick=function back(){
        calcstr=calcstr.slice(0,calcstr.length-1);
        let currinp=getInput();
        if (currinp!='0'){
            document.getElementById("input").innerText=currinp.slice(0,currinp.length-1);
            if (getInput()==''){
                document.getElementById("input").innerText='0'
            }
        }

    }
    window.addEventListener("keyup",(e)=>{
        if (e.key=="Backspace"){
            document.getElementById("del").click();
            
        }
    })
    document.getElementById("theme").onclick=function set_Theme(){
        if (document.getElementById("theme").innerText.trim()=='Dark'){
            document.getElementById("name").style.color='white';
            document.body.style.background='#2c0a21';
            document.getElementsByClassName("calculator")[0].style.background='#333';
            let btn=[];
            for (let btns of document.getElementsByClassName("light")){
                
                btn.push(btns);
            }
            for (let btns of btn){
                btns.setAttribute("class",'dark')
            }
            document.getElementById("input").style='background:grey;color:black;'
            document.getElementsByClassName("screen")[0].style='background:grey;color:white;'
            document.getElementById("theme").innerHTML=`<span class="fa fa-solid fa-sun"></span> Light`
            document.getElementById("theme").onclick=set_Theme;
        }
        else{
            document.getElementById("name").style.color='black';
            document.body.style.background='white';
            document.getElementsByClassName("calculator")[0].style.background='white';
            let btn=[];
            for (let btns of document.getElementsByClassName("dark")){
                
                btn.push(btns);
            }
            for (let btns of btn){
                btns.setAttribute("class",'light')
            }
            document.getElementById("input").style='background:#b7ebc1;color:black;'
            document.getElementsByClassName("screen")[0].style='background:#b7ebc1;color:white;'
            document.getElementById("theme").innerHTML=`<span class="fa fa-solid fa-moon"></span> Dark`
            document.getElementById("theme").onclick=set_Theme;

        }
    }
    let openac=false;
    document.getElementById("history").onclick=async function(){
        if (!openac){
            let ele=document.getElementsByClassName("hidden")[0]
            ele.classList.remove("hidden");
            ele.classList.add("actions");
            ele.innerHTML='';
            let head=document.createElement('center');
            head.innerHTML=`<label style='background:black;color:white;font-size:3vw;'>Your History</label><br><br>`;
            document.getElementsByClassName("actions")[0].appendChild(head);
            
            openac=true;
            await db.collection("users").doc("user1").onSnapshot(async res =>{
                ele.innerHTML='';
                let head=document.createElement('center');
                head.innerHTML=`<label style='background:black;color:white;font-size:3vw;'>Your History</label><br><br>`;
                document.getElementsByClassName("actions")[0].appendChild(head);
                let data=await res.data().calctext;
                for (let t of data.split(";")){
                    if (t.length!=0){
                        let label=document.createElement('center');
                        label.innerHTML=`<label>`+t+`</label>`;
                        document.getElementsByClassName("actions")[0].appendChild(label);
                        document.getElementsByClassName("actions")[0].appendChild(document.createElement('br'))
                    }
                }
            })
        }
        else{
            let ele=document.getElementsByClassName("actions")[0]
            
            ele.classList.add("hidden");
            openac=false;
            
        }
    }
    let analopen=false;
    document.getElementById("analytics").onclick=async function(){
        if (!analopen){
            let ele=document.getElementsByClassName("actions")[0];
            ele.innerHTML='';
            ele.classList.remove("hidden")
            let head=document.createElement('center');
            head.innerHTML=`<label style='background:black;color:white;font-size:3vw;'>Your Analytics</label><br><br>`;
            document.getElementsByClassName("actions")[0].appendChild(head);
            let canvas=document.createElement('center');
            canvas.innerHTML=`<canvas id="chart_canvas" width=500 height=550></canvas>`;
            document.getElementsByClassName("actions")[0].appendChild(canvas);
            document.getElementsByClassName("actions")[0].style.background='white';
            let c=document.getElementById("chart_canvas");
            let calc;
            await db.collection("users").doc("user1").onSnapshot(async res =>{
                let data=await res.data().calctext;
                let total=data.split(";").length;
                calc={"+":0,"-":0,"*":0,"/":0,"l":0,'S':0,'C':0,'E':0};
                for (let chars of data){
                    if (["+","-",'*','/','l','S','C','E'].includes(chars)){
                        calc[chars]+=1;
                    }
                }
                let config={
                    type:"bar",
                    data:{
                        labels:["+","-",'*','/','log10','Sin','Cos','Exp'],
                        datasets:[{label:"No. of occurences of operators",data:Object.values(calc)}],
                    },
                }
                let chart = new Chart(c,config)
            })
            analopen=true;
        }
        else{
            let ele=document.getElementsByClassName("actions")[0];
            ele.classList.add("hidden");
            analopen=false;
        }
    }
        
        


    
        
    
    
})();