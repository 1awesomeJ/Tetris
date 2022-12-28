document.addEventListener('DOMContentLoaded', () => {

const grid = document.querySelector('.play_area');
let boxes = Array.from(document.querySelectorAll('.play_area div'));
const gridwidth = 10;
const gridheight = 20;
let current_score = document.querySelector('.score')
const startBtn = document.getElementById("str-stp")
const modE= document.querySelector('.start')
let mode = "PLAYING"
let button = "PAUSE"
let earned_score = 0;
let timer;

const shapeColors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red']

const Ishape = [[0, gridwidth, gridwidth*2, gridwidth*3],
		[gridwidth, gridwidth+1, gridwidth+2, gridwidth+3],
		[0, gridwidth, gridwidth*2, gridwidth*3],
		[gridwidth, gridwidth+1, gridwidth+2, gridwidth+3]]

const Jshape = [[gridwidth, gridwidth+1, gridwidth+2, 0],
		[1, gridwidth+1, gridwidth*2+1, gridwidth*2],
		[gridwidth, gridwidth+1, gridwidth+2, 0],
		[1, gridwidth+1, gridwidth*2+1, 0]]

const Lshape = [[gridwidth, gridwidth+1, gridwidth+2, gridwidth*2],
		[0, gridwidth, gridwidth*2, gridwidth*2+1],
		[gridwidth, gridwidth+1, gridwidth+2, gridwidth*2],
		[0, gridwidth, gridwidth*2, 1]]

const Oshape =[[0, 1, gridwidth, gridwidth+1],
		[0, 1, gridwidth, gridwidth+1],
		[0, 1, gridwidth, gridwidth+1],
		[0, 1, gridwidth, gridwidth+1]]

const Sshape = [[ gridwidth+1, gridwidth+2, gridwidth*2, gridwidth*2+1],
		[0, gridwidth, gridwidth+1, gridwidth*2+1],
		[ gridwidth+1, gridwidth+2, gridwidth*2, gridwidth*2+1],
		[0, gridwidth, gridwidth+1, gridwidth*2+1]]

const Tshape = [[1, gridwidth+1, gridwidth+2, 2*gridwidth+1],
		[gridwidth, gridwidth+1, gridwidth+2, 2*gridwidth+1],
		[1, gridwidth+1, gridwidth, 2*gridwidth+1],
		[gridwidth, gridwidth+1, gridwidth+2, 1]]


const Zshape = [[gridwidth, gridwidth+1, gridwidth*2+1, gridwidth*2+2],
		[1, gridwidth, gridwidth+1, gridwidth*2],
		[gridwidth, gridwidth+1, gridwidth*2+1, gridwidth*2+2],
		[1, gridwidth, gridwidth+1, gridwidth*2]]



const shapes = [Ishape, Jshape, Lshape, Oshape, Sshape, Tshape, Zshape]

let start = 4
let next = 0

let sh_ptn = 0;

let k = Math.floor(Math.random() * shapes.length);

let shapeDrawn = shapes[k][sh_ptn]

	function draw(){
	shapeDrawn.forEach(i =>	{boxes[start + i].classList.add('shapes')
	boxes[start + i].style.backgroundColor = shapeColors[k]})}
	
	function erase(){
	shapeDrawn.forEach(j =>{boxes[start + j].classList.remove('shapes')
	boxes[start + j].style.backgroundColor = ''})}

	function gameOver(){
	
	if (shapeDrawn.some(i => boxes[start + i].classList.contains('settled'))){
		mode = "GAME OVER"
		modE.innerHTML = mode
		clearInterval(timer)	
		timer = null
		clearScreen()
	}
	}

	function clearScreen()
	{
	for (let i = 0; i <= 199; i++)
	{
	boxes[i].classList.remove('settled')
	boxes[i].classList.remove('shapes')
	boxes[i].style.backgroundColor = ''
	start = 4
	}
	}	

startBtn.addEventListener('keydown', (b)=>{
	if(b.keyCode == 32)
	b.preventDefault()
	})

startBtn.addEventListener('click', () =>
	{
		if (timer)
		{
		clearInterval(timer)
		timer = null
		mode = "PAUSED"
		button = "PLAY"
	document.removeEventListener('keydown', keyControls)
		modE.innerHTML = mode
		startBtn.innerHTML = button
		}
		else
		{

		const timeout =	setTimeout(draw, 3000) 
		timer = setInterval(move, 1000)
		mode = "PLAYING"
		button = "PAUSE"
	document.addEventListener('keydown', keyControls)
		modE.innerHTML = mode
		startBtn.innerHTML = button
		next = Math.floor(Math.random()*shapes.length)
		showNext()
		}
	})

	function addScore(){
	for(let i = 0; i <= 195; i += gridwidth) {
	row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
	
	if (row.every(k => boxes[k].classList.contains('settled'))){
	earned_score += 100;
	current_score.innerHTML = earned_score
	row.forEach(k => {boxes[k].classList.remove('settled')})
	row.forEach(k => {boxes[k].classList.remove('shapes')})
	row.forEach(k => {boxes[k].style.backgroundColor = ''})

	const filled = boxes.splice(i, gridwidth)
	boxes = filled.concat(boxes)
	boxes.forEach(k=> {grid.appendChild(k)})
		}
		}	
	}

	function move(){
		erase()
		start += gridwidth
		draw()
		stop_move()
	}

	function hardDrop(){
	erase()
	while(!(shapeDrawn.some(i=> boxes[start + i + gridwidth].classList.contains('settled'))))
		start += gridwidth
	draw()
	stop_move()
	}

	function stop_move(){
	if (shapeDrawn.some(i=> boxes[start + i + gridwidth].classList.contains('settled')))
	{
		shapeDrawn.forEach(i=>boxes[start + i].classList.add('settled'))
		k = next
		next = Math.floor(Math.random() * shapes.length)
		shapeDrawn = shapes[k][sh_ptn]
		start = 4
		draw()
		showNext()
		addScore()
		gameOver()
	}
	}

 
	function mv_left(){
	erase()
	const atLeftEdge = shapeDrawn.some(i =>(start+i) % gridwidth ==0)
	if(!atLeftEdge)
	start -= 1;
	if (shapeDrawn.some(i => boxes[start+i].classList.contains('settled')))
		start += 1
	draw()
	}

	function mv_right(){
	erase()
	const atRightEdge = shapeDrawn.some(i =>(start+i) % gridwidth == (gridwidth-1))
	if(!atRightEdge)
	start += 1;
	if (shapeDrawn.some(i => boxes[start+i].classList.contains('settled')))
		start -= 1
	draw()
	}

	function rotate(){
	erase()
	sh_ptn++
	if (sh_ptn == shapeDrawn.length)
	sh_ptn = 0

	let p = start
	shapeDrawn = shapes[k][sh_ptn]
	 if ((shapeDrawn.some(i =>(start+i) % gridwidth == 2)) && (start % gridwidth > 3))
	start -= 3
	 else if ((shapeDrawn.some(i =>(start+i) % gridwidth == 1)) && (start % gridwidth > 3))
	start -= 2
	else if ((shapeDrawn.some(i =>(start+i) % gridwidth == 0)) && (start % gridwidth > 3))
	start --
	else
	start = p
	draw()
	}

	function keyControls(pr){
	if(pr.keyCode ===37 || pr.keyCode===65)
	mv_left()
	else if (pr.keyCode ==38 || pr.keyCode == 88)
	rotate()
	else if (pr.keyCode == 39 || pr.keyCode == 68)
	mv_right()
	else if (pr.keyCode == 40 || pr.keyCode == 83)
	move()
	else if (pr.keyCode == 32)
	hardDrop()
	}

document.addEventListener('keydown', keyControls)

const upNext = Array.from(document.querySelectorAll('.up_next div'))


const displayWidth = 4;
let dIndex = 0;

Next_shape = [[1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],
		[displayWidth, displayWidth+1, displayWidth+2, 0],
		[displayWidth, displayWidth+1, displayWidth+2, displayWidth*2],
		[0, 1, displayWidth, displayWidth+1],
		[ displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1],
		[1, displayWidth+1, displayWidth+2, 2*displayWidth+1],
		[displayWidth, displayWidth+1, displayWidth*2+1, displayWidth*2+2]]


	function showNext(){
	upNext.forEach(i => {i.classList.remove('colorNext')
	i.style.backgroundColor = ''})
	Next_shape[next].forEach(i => {upNext[i].classList.add('colorNext')
	upNext[i].style.backgroundColor = shapeColors[next]})
	}
		
})
