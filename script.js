let plyrhlth=document.getElementById("plyhlt");
let syshlth=document.getElementById("syshlt");
let keys=document.getElementById("keys");
let shards=document.getElementById("shards");
let highscore=document.getElementById("highscore");
let help=document.getElementById("helpbtn");

let score=0;

let totalkeys=0;
let keyscollected=0;
let keysdelivered=0;
let totalkeyscoll=0;
let totalkeysdelivered=0;

let attachedshard=null;

let playerhlth=100;
let systemhlth=80;

let flag=false;
let i=0;
let keycollval=3;

let Rules ={
    r1:"Rules & Regulations:\n",
    r2:"1.Collect Keys by destorying Buildings.\n",
    r3:"2.Use Keys to Help AUREX by delivering Shards.\n",
    r4:"3.Delivering Keys at Central Hub provides Shards\n",
    r5:"4.Each Shard requires specific No.of Keys to decrypt.\n",
    r6:"5.System Health increases on each delivery of Shards and Keys\n",
    r7:"6.Player Wins! if system Health reaches 100% \n" ,
    r8:"7.Player Health Decreases! under Surveillance Towers \n",
    r9:"8.Player Loses! On Player Health or System Health becomes Zero..!",
    // r10:"9.Have a Happy GamePlay..!"
}    

let rularr="";
Object.entries(Rules).forEach(([key,value])=>{
    rularr=rularr+value;
});

function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

let pausebtn=document.getElementById("pause");
let resumebtn=document.getElementById("resume");
let resetbtn=document.getElementById("reset");
let pausebtnres=false;

resetbtn.addEventListener("click", function() {
    savescore();
    location.reload();
});

pausebtn.addEventListener("click", function() {
    pausebtnres=true;
});

resumebtn.addEventListener("click", function() {
    pausebtnres=false;
});

help.addEventListener("click", function() {
    alert(rularr);
});


let canvas=document.getElementById('can1'); //map
let canvas2=document.getElementById('can2'); //Radar
let canvas3=document.getElementById('can3'); //Player
let canvas4=document.getElementById('can4'); //Bullets
let canvas5=document.getElementById('can5'); //keys
let canvas6=document.getElementById('can6'); //Buildings
let canvas7=document.getElementById('can7'); //shards
let canvas8=document.getElementById('can8'); //alert
let allcan=[canvas,canvas2,canvas3,canvas4,canvas5,canvas6,canvas7,canvas8];

canvas.width=3000;
canvas.height=2000;
canvas2.width=3000;
canvas2.height=2000;
canvas3.width=3000;
canvas3.height=2000;
canvas4.width=3000;
canvas4.height=2000;
canvas5.width=3000;
canvas5.height=2000;
canvas6.width=3000;
canvas6.height=2000;
canvas7.width=3000;
canvas7.height=2000;
canvas8.width=3000;
canvas8.height=2000;


let c=canvas.getContext('2d');
let c2=canvas2.getContext('2d');
let c3=canvas3.getContext('2d');
let c4=canvas4.getContext('2d');
let c5=canvas5.getContext('2d');
let c6=canvas6.getContext('2d');
let c7=canvas7.getContext('2d');
let c8=canvas8.getContext('2d');

let mousemovement={
    x: undefined,
    y:undefined,
}

document.addEventListener('mousemove',(eve)=>{

    const rect2=canvas.getBoundingClientRect()
    mousemovement.x=eve.clientX-rect2.left;
    mousemovement.y=eve.clientY-rect2.top;
});


let plyrdetail={
    x:200*(parseInt(Math.random()*8)+1),
    y:200*(parseInt(Math.random()*8)+1),
    speed:7,
}

function cirrectcollison(cx,cy,r,rx,ry,w,h){
    let closex=Math.max(rx,Math.min(cx,rx+w));
    let closey=Math.max(ry,Math.min(cy,ry+h));
    let dx=cx-closex;
    let dy=cy-closey;

    if((dx*dx+dy*dy)<=(r*r)){
        return true;
    }
    else{
        return false;
    }
}

function resolvecoll(cx,cy,r,rect){
    const rx= rect.x;
    const ry= rect.y;

    const dlx=cx-(Math.max(rx,Math.min(cx,rx+60)));
    const dly=cy-(Math.max(ry,Math.min(cy,ry+60)));
    const dist=Math.sqrt(dlx*dlx+dly*dly);

    if(dist===0 || dist>=r) return {x: cx , y: cy};

    const overlap=r-dist;
    const pushX=(dlx/dist)*overlap;
    const pushY=(dly/dist)*overlap;

    return {
        x: cx+pushX,
        y: cy+pushY,
    };
}

function circircoll(cx1,cy1,r1,cx2,cy2,r2){
    if(distance(cx1,cy1,cx2,cy2)<r1+r2) return true;
    else return false;
}


function arccircoll(arcx,arcy,arcr,startang,endang,cxx,cyy,crr){
    const dxx=cxx-arcx;
    const dyy=cyy-arcy;
    const dis=Math.sqrt(dxx*dxx+dyy*dyy);

    if(dis>=arcr+crr) return false;

    let angtocir=Math.atan2(dyy,dxx);
    if(angtocir<0) angtocir+=(2*Math.PI);

    startang= startang%(2*Math.PI);
    endang= endang%(2*Math.PI);
    if(startang<0) startang+=(2*Math.PI);
    if(endang<0) endang+=(2*Math.PI);

    let inRange;
    if(startang<endang){
        inRange= ((angtocir>=startang) && (angtocir<=endang));
    }
    else{
        inRange= ((angtocir>=startang) || (angtocir<=endang));
    }

    return (inRange && dis<(arcr+crr));
}

function radalert(ctx,val){
    if(val){
        ctx.clearRect(0,0,3000,2000);
        ctx.fillRect(0,0,3000,2000);
        ctx.fillStyle='rgba(255,0,0,0.15)';
        ctx.fill();
        
    }
    else{
        ctx.clearRect(0,0,3000,2000);
    }
}

let buildarr=[];
class Building{
    constructor(xx,yy){
        this.x=xx;
        this.y=yy;
        this.j=0;
        this.buildcoll=false;
    }
    createBuild(){
        c6.fillStyle='black';
        c6.fillRect(this.x,this.y,60,60);
    }
}




let radararr=[];
class Radar{
    constructor(x9,y9){
        this.x=x9;
        this.y=y9;
        this.angleoffset=0;
        this.startangle=Math.random()*(Math.PI);
        this.endangle=this.startangle+(Math.PI)/4;
        this.hitcount=0;
    }

    updatearc(){
        if(!pausebtnres){
            this.angleoffset=this.angleoffset+((Math.PI)/540);
            this.varstart=this.startangle+this.angleoffset;
            this.varend=this.angleoffset+this.endangle;
        }
    }

    drawarc(){
        c2.beginPath();
        c2.moveTo(this.x,this.y);
        c2.arc(this.x,this.y,100,this.startangle+this.angleoffset,this.angleoffset+this.endangle,false);
        c2.strokeStyle='rgba(255,0,0,0.7)';
        c2.fillStyle='rgba(255,0,0,0.2)';
        c2.fill();
        c2.lineTo(this.x,this.y);
        c2.stroke();
        c2.lineWidth=2;
        c2.closePath();

        c2.beginPath();
        c2.arc(this.x,this.y,10,0,(Math.PI)*2,false);
        c2.fillStyle='rgba(255,0,0,0.7)';
        c2.fill();
    }

    clearrad(){
        c2.clearRect(this.x-100,this.y-100,200,200);
    }
}



let bullx;
let bully;
let bullspeedx;
let bullspeedy;
let bulldist;
let bulx;
let buly;
let bulpstnx;
let bulpstny;

let buildtoremove=[];
let radartoremove=[];

class Bullet{
    constructor(startx,starty,targetx,targety){
        this.x=startx;
        this.y=starty;
        
        const dist= distance(startx,starty,targetx,targety);
        this.vx=(targetx-startx)/dist*10;
        this.vy=(targety-starty)/dist*10;
    }

    update(){
        if(this.x<5 || this.x>=3000-4){
            this.vx=-this.vx;
            this.vx*=0.55;
            this.vy*=0.55;
            this.x=Math.max(4,Math.min(this.x,3000-4));
        }
        if(this.y<5 || this.y>=2000-4){
            this.vy=-this.vy;
            this.vx*=0.55;
            this.vy*=0.55;
            this.y=Math.max(4,Math.min(this.y,2000-4));
        }
        this.x+=this.vx;
        this.y+=this.vy;

        buildarr.forEach((build)=>{
            if(cirrectcollison(this.x,this.y,4,build.x,build.y,60,60)){
                if(Math.abs(this.x-(Math.max(build.x,Math.min(this.x,build.x+60)))) > Math.abs(this.y-(Math.max(build.y,Math.min(this.y,build.y+60))))){
                    this.vx= -this.vx;
                }
                else{
                    this.vy= -this.vy;
                }

                this.vx*=0.8;
                this.vy*=0.8;
                build.j++;
                
                if(build.j>3){
                    buildtoremove.push(build);
                }
            }
        });

        radararr.forEach((radar)=>{
            if(circircoll(this.x,this.y,4,radar.x,radar.y,10)){
                this.vx= -(this.vx*0.6);
                this.vy= -(this.vy*0.6);
                radar.hitcount++;

                if(radar.hitcount>3){
                    radartoremove.push(radar);
                }
            }
        })
        if(radartoremove.length>0){
            radararr=radararr.filter(radar => !radartoremove.includes(radar));
            radartoremove=[];
        }


        if(buildtoremove.length>0){
            buildarr=buildarr.filter(build => !buildtoremove.includes(build));
            c6.clearRect(0,0,3000,2000);
            buildarr.forEach(b => b.createBuild());
        }

        const speed=Math.sqrt(this.vx*this.vx+this.vy*this.vy);
        if(speed<2.5){
            this.bullflag=true;
        }
    }

    draw(c4){
        c4.beginPath();
        c4.arc(this.x,this.y,4,0,Math.PI *2,false);
        c4.fillStyle="rgba(255,255,255,0.95)";
        c4.fill();
    }
}

let bullets=[];
document.addEventListener("click",(e)=>{
    if(pausebtnres || e.target.tagName === "BUTTON" || e.target.id==="topbox") return;

    const rect=canvas4.getBoundingClientRect();
    bullx=e.clientX-rect.left;
    bully=e.clientY-rect.top;

    let bullet = new Bullet(plyrdetail.x,plyrdetail.y,bullx,bully);
    bullets.push(bullet);
});

function animateBullets(){
    if(!pausebtnres){
        c4.clearRect(0,0,3000,2000);
        bullets.forEach((bullet)=>{
            bullet.update();
            bullet.draw(c4);
        });
        bullets=bullets.filter(bullet => !bullet.bullflag);
    }
    requestAnimationFrame(animateBullets);
}

animateBullets();




let arr=[];
function rndmarr(){
    arr=[];
    let n;
    while(arr.length<3){
        n=Math.floor(Math.random()*14);
        if(!arr.includes(n)){
            arr.push(n);
        }
    }
}

let keysarr=[];
let keycollord=[3,6,9,12];
class Keys{
    constructor(xxx,yyy){
        this.x=xxx;
        this.y=yyy;
        this.collected=false;
        this.delivered=false;
    }
    createkey(){
        c5.beginPath();
        c5.arc(this.x,this.y,5,0,(Math.PI)*2,false);
        c5.fillStyle='rgb(255, 75, 129)';
        c5.fill();
    }
    clearkey(){
        c5.clearRect(this.x-10,this.y-10,20,20);
    }
}

let shardsarr=[];
let totalshards=4;
class Shards{
    constructor(x7,y7){
        this.x=x7;
        this.y=y7;
        this.attached=true;
        this.delivered=false;
    }
    createshard(){
        c7.beginPath();
        c7.arc(this.x,this.y,7,0,(Math.PI)*2,false);
        c7.fillStyle='rgb(255, 247, 5)';
        c7.fill();
        c7.font="2px Arial";
        c7.fillStyle='white';
        c7.fillText("S",this.x,this.y)
    }
    clearshard(){
        c7.clearRect(this.x-10,this.y-10,20,20);
    }
}



let basestarr;
let centralhubarr;

class Basestn{
    constructor(x3,y3){
        this.x=x3;
        this.y=y3;
    }
    createbase(){
        c.fillStyle='blue';
        c.fillRect(this.x,this.y,150,150);
        c.fill();
        c.fillStyle='red';
        c.fillRect(this.x+20,this.y+20,111,111);
        c.fill();
        c.font="18px Arial";
        c.fillStyle='white';
        c.fillText("Base Station",this.x+24,this.y+80);
    }
}

class CentHub{
    constructor(x3,y3){
        this.x=x3;
        this.y=y3;
    }
    createhub(){
        c.fillStyle='blue';
        c.fillRect(this.x,this.y,150,150);
        c.fill();
        c.fillStyle='red';
        c.fillRect(this.x+20,this.y+20,110,110);
        c.fill();
        c.font="18px Arial";
        c.fillStyle='white';
        c.fillText("Central Hub",this.x+25,this.y+80);
    }
}


for(let i=0;i<10;i++){
    rndmarr();
    for(let j=0;j<15;j++){
        c.strokeStyle='#00D32F';
        c.strokeRect(200*(j),200*(i),200,200);

        if(i==9 && j==12){
            let basehb= new Basestn((200*j)+25,(200*i)+25);
            basehb.createbase();
            basestarr=basehb;
        }

        else if(i==5 && j==7){
            let centhb= new CentHub((200*j)+25,(200*i)+25);
            centhb.createhub();
            centralhubarr=centhb;
        }

        else{
            c.fillStyle='#00D32F';
            c.fillRect((200*j)+25,(200*i)+25,150,150);

            for(let k=0;k<4;){
                let valx=(Math.random()*150)+(200*j)+25;
                let valy=(Math.random()*150)+(200*i)+25;
                if(valx>(200*j+25+5) && valy>(200*i+25+5) && valx<(200*j+88+25) && valy<(200*i+88+25)){
                    let newbuild= new Building(valx,valy);
                    newbuild.createBuild();
                    buildarr.push(newbuild);
                    k++;
                    if(k==4 && arr.includes(j)){
                        let newkey= new Keys(valx+5+(Math.random()*30),valy+5+(Math.random()*30));
                        newkey.createkey();
                        keysarr.push(newkey);
                        totalkeys+=1;
                    }  
                }
                else{
                    valx=(Math.random()*150)+(200*j)+25;
                    valy=(Math.random()*150)+(200*i)+25;
                }
            }

            let newrad= new Radar(100+(200*j),100+(200*i));
            radararr.push(newrad);
        }
        

    }
}


function animateradar(){  
    if(!pausebtnres){
        c2.clearRect(0,0,3000,2000);
        radararr.forEach((radar)=>{
            radar.updatearc();
            radar.drawarc();
        })
    }
    requestAnimationFrame(animateradar);
}
animateradar();

let alertflag=false;
function keyscollect(){
    keysarr.forEach((key)=>{
        if(!key.collected && keyscollected<keycollord[i] && distance(plyrdetail.x,plyrdetail.y,key.x,key.y)<=13){
            if(attachedshard===null){
                key.collected=true;
                keyscollected++;
                score=score+5;
                totalkeyscoll++;
                keys.innerHTML=keyscollected;
            }
            else{
                if(!alertflag){
                    alert("Deliver the Shard \uD83D\uDCFf");
                    alertflag=true;
                }
            }
        }
       
    });
}

function keysdeliver(){
    keysarr.forEach((key)=>{
        if(key.collected && !key.delivered && cirrectcollison(plyrdetail.x,plyrdetail.y,9,centralhubarr.x+20,centralhubarr.y+20,110,100)){
            key.delivered=true;
            playerhlth=Math.min(100,playerhlth+4);
            systemhlth=Math.min(80,systemhlth+2);
            score=score+10;
            key.clearkey();
            keysdelivered++;
            totalkeysdelivered++;
        }
    })

    if(keysdelivered===keycollval && attachedshard===null && i<keycollord.length){
        let newshard=new Shards(plyrdetail.x+9,plyrdetail.y);
        newshard.createshard();
        attachedshard=newshard;
        shardsarr.push(newshard);
        keysdelivered=0;
        keyscollected=0;
        keys.innerHTML=keyscollected;
        flag=false;
        i++;
        score=score+15;
        if(i<keycollord.length){
            keycollval=keycollord[i];
            alert('shard \uD83D\uDCFf generated! Deliver it to Base');
        }
        else{
            alert('shard \uD83D\uDCFf generated! Deliver it to Base');
            alert("All Keys \uD83D\uDD11 are Collected");
        }
    }
}

function sharddeliver(){
    if(attachedshard && !attachedshard.delivered && cirrectcollison(plyrdetail.x,plyrdetail.y,9,basestarr.x+20,basestarr.y+20,110,110)){
        attachedshard.delivered=true;
        score=score+20;
        attachedshard.clearshard();
        shardsarr=shardsarr.filter(shard=> !shard.delivered);
        attachedshard=null;
        playerhlth=Math.min(100,playerhlth+(7*i));
        systemhlth=Math.min(80,systemhlth+(5*i));
        plyrhlth.innerHTML=playerhlth;
        syshlth.innerHTML=systemhlth;
        alertflag=false
        alert('Shard \uD83D\uDCFf Delivered,Collect '+keycollval+ '\uD83D\uDD11 keys for next shard');

        if(i>=keycollord.length){
            alert("Player Won\u{1F3C6} AUREX retrieved!");
            location.reload();
        }
    }
}


document.addEventListener("keydown",(e)=>{
    e.preventDefault();
    if(pausebtnres) return;

    let newX=plyrdetail.x;
    let newY=plyrdetail.y;

    if(e.key ==="ArrowUp"){
        newY-=plyrdetail.speed;
    } 
    else if(e.key ==="ArrowDown"){
        newY+=plyrdetail.speed;
    } 
    else if(e.key ==="ArrowLeft"){
        newX-=plyrdetail.speed;
    } 
    else if(e.key ==="ArrowRight"){
        newX+=plyrdetail.speed;
    }

    if(newX<=9 || newX>=3000-9 || newY<=9 || newY>=2000-9){
        return;
    }


    let coll=false;
    for(let build of buildarr){
        if(cirrectcollison(newX,newY,9,build.x,build.y,60,60)){
            const corr= resolvecoll(newX,newY,9,build);
            newX=corr.x;
            newY=corr.y;
            coll=true;
        }
    }

    if(cirrectcollison(plyrdetail.x,plyrdetail.y,9,centralhubarr.x+20,centralhubarr.y+20,110,110) && i<4){
        if(!flag && i==0){
            alert("collect "+keycollord[i]+ " \uD83D\uDD11Keys");
            flag=1;
        }
    }
    
    if(!coll){
        plyrdetail.x=newX;
        plyrdetail.y=newY; 
    }

});

function plyrmovement(){
    c3.clearRect(0,0,3000,2000);
    c5.clearRect(0,0,3000,2000);
    c7.clearRect(0,0,3000,2000);

    c3.beginPath();
    c3.fillStyle="rgba(255, 255, 255, 0.95)";
    c3.arc(plyrdetail.x,plyrdetail.y,9,0,Math.PI *2,false);
    c3.fill();
    
    keyscollect();
    keysdeliver();
    sharddeliver();

    keysarr=keysarr.filter(key =>!key.delivered);

    keysarr.forEach((key)=>{
        if(key.collected && !key.delivered){
            key.clearkey();
            key.x=plyrdetail.x+9;
            key.y=plyrdetail.y;
        }
        if(!key.delivered){
            key.createkey();
        }
    });

    radalert(c8,isplyrinanyrad());

    if(attachedshard && !attachedshard.delivered){
        attachedshard.clearshard();
        attachedshard.x=plyrdetail.x+9;
        attachedshard.y=plyrdetail.y;
        attachedshard.createshard();
    }

    if(!pausebtnres){
        requestAnimationFrame(plyrmovement);
    }
}

plyrmovement();




function savescore(){
    let scores=localStorage.getItem("gameScores");
    scores=scores ? JSON.parse(scores):[];
    scores.push(score);
    localStorage.setItem("gameScores",JSON.stringify(scores));
}

function displayHighscore(){
    let scores =localStorage.getItem("gameScores") ;
    scores=scores ? JSON.parse(scores):[];
    if(scores.length===0){
        return;
    }
    const highscre = Math.max(...scores);
    highscore.innerHTML= highscre;
}


window.onload= ()=>{
    displayHighscore();
}


function isplyrinanyrad(){
    for(let rad of radararr){
        if(arccircoll(rad.x,rad.y,100,rad.varstart,rad.varend,plyrdetail.x,plyrdetail.y,9)){
            return true;
        }
    }
}

let startalert;
function strtalert(){
    clearInterval(startalert);
    startalert=setTimeout(()=>{
        alert("Welcome to AUREX\u{1F49A}\nHave a Safe and Happy Gameplay..!");
    },500);
}
strtalert();

let plyhlthInterval;
let syshlthInterval;
let hlthtick=0;
function plyhlthtmr(){
    clearInterval(plyhlthInterval);
    plyhlthInterval=setInterval(function(){
        if(!pausebtnres){

            if(playerhlth>0 && isplyrinanyrad()){
                playerhlth=playerhlth-1;
                plyrhlth.innerHTML = playerhlth;
            }

            else if(playerhlth>0 && !isplyrinanyrad()){
                hlthtick++;
                if(hlthtick>=10){
                    playerhlth--;
                    plyrhlth.innerHTML = playerhlth;
                    hlthtick=0;
                }
            }
            else{
                alert("Player health is zero!");
                alert("You Lost! Try Again\uD83D\uDD01");
                savescore();
                location.reload();
                plyhlthtmr();
            }
        }
        else{
            playerhlth=playerhlth+0;
        }
        if(systemhlth===100){
            alert("Player Won\u{1F3C6}");
            savescore();
            location.reload();
        }
    }, 500);
}



function syshlthtmr(){
    clearInterval(syshlthInterval);
    syshlthInterval=setInterval(function(){
        if(!pausebtnres){
            if(systemhlth>20){
                systemhlth--;
                syshlth.innerHTML = systemhlth;
            }
            else{
                alert("System health is below Limit! , Can't retrieve AUREX");
                alert("You Lost!\uD83D\uDD01");
                savescore();
                location.reload();
                syshlthtmr();
            }
        }
        else{
            systemhlth=systemhlth+0;
        }
    }, 10000);
}


syshlthtmr();
plyhlthtmr();