console.log('[Daniel Rodrigues] Flappy Bird')

const sprites = new Image()
sprites.src = 'sprites.png'

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

//Personagem principal
const flappyBird = { 
    spriteX:0,
    spriteY:0,
    largura:34,
    altura:24,
    x:10,
    y:50,
    gravidade: 0.25,
    velocidade:0,
    desenha(){
        contexto.drawImage(
            sprites,
            flappyBird.spriteX,flappyBird.spriteY,
            flappyBird.largura,flappyBird.altura,
            flappyBird.x, flappyBird.y,
            flappyBird.largura,flappyBird.altura
        )
    },
    atualiza(){
        flappyBird.velocidade += flappyBird.gravidade
        flappyBird.y = flappyBird.y+flappyBird.velocidade;
    }
}
  
//Chão
const chao = {
    spriteX:0,
    spriteY:610,
    largura:224,
    altura:112,
    x:0,
    y:canvas.height-112,
    desenha(){
        contexto.drawImage(
            sprites,
            chao.spriteX,chao.spriteY,
            chao.largura,chao.altura,
            chao.x, chao.y,
            chao.largura,chao.altura
        )
        contexto.drawImage(
            sprites,
            chao.spriteX,chao.spriteY,
            chao.largura,chao.altura,
            (chao.x+chao.largura), chao.y,
            chao.largura,chao.altura
        )
    }
}

//Plano de Fundo
const planoDeFundo = {
    spriteX:390,
    spriteY:0,
    largura:275,
    altura:204,
    x:0,
    y:canvas.height - 204,
    desenha(){
        contexto.fillStyle = '#70c5ce'
        contexto.fillRect(0,0,canvas.width,canvas.height)
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX,planoDeFundo.spriteY,
            planoDeFundo.largura,planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura,planoDeFundo.altura
        )
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX,planoDeFundo.spriteY,
            planoDeFundo.largura,planoDeFundo.altura,
            (planoDeFundo.x+ planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura,planoDeFundo.altura
        )
    }
}



/* O desenho dos elementos várias vezes por segundo(FPS)
A função requestAnimationFrame() ajuda a desenhar os quadros na tela da forma mais inteligente possível
A função loop vai ficar desenhando os elementos na imagem de forma infinita */
function loop(){
    planoDeFundo.desenha()
    flappyBird.atualiza()
    flappyBird.desenha()
    chao.desenha()
    requestAnimationFrame(loop)
}

loop()