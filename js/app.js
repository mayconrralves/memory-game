/*
 * Create a list that holds all of your cards
 */
const listTypeCards = ["fa-diamond","fa-paper-plane-o","fa-anchor","fa-bolt","fa-cube","fa-leaf","fa-bicycle","fa-bomb"];
//variáveis globais para o relógio
var watch;
var time;
var maxTime;
//variável para contar quantas estrelas serão exibidas
var stars;
//variável para contar movimentos
var moves;
//variável para calcular a pontuação;
var score;
//variável que armazena o número de pares revelados
var pairShow;
//variável para o deck de cartas
var cards = [];
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
 //constroi o deck com 16 cards embaralhados
function constructionDeck(array) {
	let cards =[];
	for(let i=0; i < array.length; i++)
		//dobra o número de cards
		cards.push(array[i], array[i]);
	return shuffle(cards);
}
//adiciona id ao array de cards abertos
function addIdList(id,idList) {
	if(!id)
		return
	if($("#"+id).hasClass("match"))
		return;
	idList.push(id);
}
//abre o card escolhido
function openCard(id) {

	$("#"+id).children().addClass(cards[id]);
	$("#"+id).addClass("open show");
}
//fecha os cards
function closeCard(id) {
	$("#"+id).children().removeClass(cards[id]);
	$("#"+id).removeClass("open show");
}
//define os cards que não serão mais abertos
function addMatch(id) {
	$("#"+id[0]).addClass("match");
	$("#"+id[0]).removeClass("open show");
	$("#"+id[1]).addClass("match");
	$("#"+id[1]).removeClass("open show");
}
//verifica se dois cards são iguais
function verifyCombination(idList) {
	if(idList.length === 2) {
		if(idList[0]===idList[1]) {
			idList.length = 1;
			return;
		}
		if (cards[idList[0]] === cards[idList[1]]) {
			calcPairShow();
			countScore();
			addMatch(idList);
			idList.length=0;
		}
		else {
			setTimeout(function(){
				closeCard(idList[0], cards);
				closeCard(idList[1], cards);
				idList.length=0;
			},400);
		}
		countMoves();
	}
}
//função resnposável por capturar os cliques
function cardClick(event, idList) {
	if(idList.length<2){
			addIdList(event.target.id,idList);
			openCard(idList[idList.length-1],cards);
			verifyCombination(idList,cards);
		}
}
//inicia as estrelas para pontuação
function initStars() {
	for(let i=0; i < 3; i++) {
		$(".stars").append("<li><i class='fa fa-star star-blue'></i></li>");
	}
}
//calcula a quantidade de estrelas
function calcStars() {
	let stars = $(".fa-star");
	if(moves > 25)
		return;
	if(moves == 16){
		$(stars[2]).removeClass("star-blue");
	}
	else if (moves == 25)
		$(stars[1]).removeClass("star-blue");
}
//inicializa estrelas
function initMoves() {
	moves = 0;
	$(".moves").html(moves);
}
//conta quantos movimentos foram feitos
function countMoves() {
		moves++;
		$(".moves").html(moves);
}
//incializa o score;
function initScore() {
	score = 0;
}
//inicializa o numero de pares corretos
function initPairShow() {
	pairShow = 0;
}
function calcPairShow(){
	pairShow++;
}
//calcula o score
function countScore() {
	score += stars*time;
}
//adiciona os cards a interface
function constructionGameInterface() {
	$(".deck").html("");
	for(let i=0; i < cards.length; i++)
		$(".deck").append("<li class='card' id='"+i+"'><i class='fa'></i></li>");
}
//função para o relógio
function clock() {
	let seg = time%60;
	let min = parseInt(time/60);
	if(time > -1) {
		if(seg < 10)
			seg = "0"+ seg;
		if(min < 10)
			min="0" + min;
		$(".clock").html(min+":"+seg);
		time--;				
	}
	if(time < 0){
		endGame();
	}
}
//inicia o relógio
function initTime(minute, second) {
	time = minute*60+second;
	initMoves();
	watch = setInterval(clock, 1000);
	stars = setInterval(calcStars);
}
//termina o jogo
function endGame() {
	clearInterval(stars);
	clearInterval(watch);
}
//inicia o jogo
function initGame(idList, minute, second) {
	cards = constructionDeck(listTypeCards);
	console.log(cards);
	idList = [];
	constructionGameInterface();
	initScore();
	initPairShow();
	initStars();
	initTime(minute, second);
	calcStars(minute,second);
}
//reinicia jogo
function restart(idList, minute, second) {
	$(".deck").html("");
	$(".stars").html("");
	clearInterval(stars);
	clearInterval(watch);
	initGame(idList, minute, second);
}
$(document).ready(function() {
	//cards abertos
	let idList = [];
	//tempo máximo do jogo
	let minute = 1;
	let second = 30;
	maxTime = minute*60+second;
	$(".deck").on("click",function(event) {
		cardClick(event, idList, cards)
	});
	$(".restart").on("click", function(event) {
		restart(idList, minute, second);
	});
 	initGame(idList,  minute, second);
});