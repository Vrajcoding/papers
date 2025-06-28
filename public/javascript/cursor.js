const cursor = document.querySelector("#cursor");
const h1 = document.querySelector(".heading");
const menu = document.querySelector(".profile-pic")
const cross = document.querySelector("#cross");
const tl = gsap.timeline();

window.addEventListener("mousemove",function(e){
    gsap.to(cursor,{
        x:e.x,
        y:e.y,
        duration:0.3
    })
})

 gsap.from(h1,{
    y:200,
    opacity:0,
    duration:1,
    ease: "power1.out"
 })

 tl.to(".overlay", {
    left: 0,
    duration: 0.5
 }) 
 
 tl.from(".overlay h2", {
    y: 150,
    duration: 0.7,
    opacity: 0,
    stagger:0.5
 })

 tl.from(".overlay i", {
    opacity: 0
 })
 
 tl.pause();

 menu.addEventListener("click", function(){
    tl.play();
 })

 cross.addEventListener("click",function(){
    tl.reverse();
 })





