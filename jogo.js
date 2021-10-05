console.log('[Daniel Rodrigues] Flappy Bird')

let frames = 0;

const som_HIT = new Audio()
som_HIT.src = './efeitos/efeitos_hit.wav'


const sprites = new Image()
sprites.src = 'sprites.png'

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')


function fazColisao(flappyBird, chao){
    const flappyBirdY = flappyBird.y + flappyBird.altura
    const chaoY = chao.y
    if(flappyBirdY>= chaoY){
        return true
    }else{
        return false
    }
}

//Personagem principal
function criaFlappyBird(){
    const flappyBird = { 
        spriteX:0,
        spriteY:0,
        largura:34,
        altura:24,
        x:10,
        y:50,
        pulo: 4.6,
        pula(){
            flappyBird.velocidade = -flappyBird.pulo
        },
        gravidade: 0.15,
        velocidade:0,
        frameAtual:0,
        atualizaOFrameAtual(){
            const intervaloDeFrames = 10;
            const passouIntervalo = frames % intervaloDeFrames === 0

            if(passouIntervalo){

                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual
                const baseRepeticao = flappyBird.movimentos.length
                flappyBird.frameAtual = incremento % baseRepeticao
            }
        },
        desenha(){
            const {spriteX, spriteY} = this.movimentos[this.frameAtual]

            contexto.drawImage(
                sprites,
                spriteX,spriteY,
                flappyBird.largura,flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura,flappyBird.altura
            )
            this.atualizaOFrameAtual()
        },
        atualiza(){
            if(fazColisao(flappyBird, globais.chao)){
                som_HIT.play()

                setTimeout(()=>{
                    mudaParaTela(Telas.GAME_OVER)
                }, 500)
                
                return
            }
    
            flappyBird.velocidade += flappyBird.gravidade
            flappyBird.y = flappyBird.y+flappyBird.velocidade;
        },
        movimentos: [
            {spriteX:0, spriteY:0,},
            {spriteX:0, spriteY:26,},
            {spriteX:0, spriteY:52,},
            {spriteX:0, spriteY:26,},
        ]
    }
    return flappyBird
}

//Chão
function criaChao(){
    const chao = {
        spriteX:0,
        spriteY:610,
        largura:224,
        altura:112,
        x:0,
        y:canvas.height-112,
        atualiza(){
            const movimentoDoChao = 1
            const repeteEm = chao.largura/2
            const movimentacao = chao.x - movimentoDoChao

            chao.x = movimentacao % repeteEm
        },
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
    return chao
}

//Canos
function criaCanos(){
    const canos = {
        largura: 52,
        altura: 400,
        chao:{
            spriteX: 0,
            spriteY: 169,
        },
        ceu:{
            spriteX: 52,
            spriteY: 169,
        },
        espaco:80,
        desenha(){
            
            canos.pares.forEach(function(par){
                const yRandom = par.y
                const espacamentoEntreCanos = 90
                
                // [Cano do Céu]
                const canoCeuX = par.x
                const canoCeuY = yRandom
    
    
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura,canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura,canos.altura,
                )
                
                // [Cano do Chao]
                const canoChaoX = par.x
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura,canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura,canos.altura,
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y:canos.altura + canoCeuY
                }
                par.canoChao = {
                    x:canoChaoX,
                    y:canoChaoY
                }
            })
        },
        temColisaoComOFlappyBird(par){
            const cabecaDoFlappy= globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura
            if(globais.flappyBird.x + globais.flappyBird.largura >= par.x){
                if(cabecaDoFlappy <= par.canoCeu.y){
                    return true
                }

                if(peDoFlappy >= par.canoChao.y){
                    return true
                }

            }

            return false
        },
        pares:[],
        atualiza(){
            const passou100frames = frames%100 === 0


            if(passou100frames){
                canos.pares.push( {
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }

            canos.pares.forEach(function(par){
                par.x -=2

                if(canos.temColisaoComOFlappyBird(par)){
                    mudaParaTela(Telas.GAME_OVER)
                    som_HIT.play()
                }

                if(par.x + canos.largura <= 0){
                    canos.pares.shift()
                }
            })


        }
    }
    return canos
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

//Tela Inicial
const mensagemGetReady = {
    spriteX:134,
    spriteY:0,
    largura:174,
    altura:152,
    x:(canvas.width / 2) - 174 / 2,
    y:50,
    desenha(){
        contexto.drawImage(
            sprites,
            mensagemGetReady.spriteX,mensagemGetReady.spriteY,
            mensagemGetReady.largura,mensagemGetReady.altura,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.largura,mensagemGetReady.altura
        )
    }
}
const mensagemGameOver = {
    spriteX:134,
    spriteY:153,
    largura:226,
    altura:200,
    x:(canvas.width / 2) - 226 / 2,
    y:50,
    desenha(){
        contexto.drawImage(
            sprites,
            mensagemGameOver.spriteX,mensagemGameOver.spriteY,
            mensagemGameOver.largura,mensagemGameOver.altura,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.largura,mensagemGameOver.altura
        )
    }
}

function criaPlacar(){
    const placar = {
        pontuacao : 0,
        desenha(){
            contexto.font = '35px "VT323"'
            contexto.textAlign = 'right'
            contexto.fillStyle = 'white'
            contexto.fillText(placar.pontuacao, canvas.width - 10, 35)
        },
        atualiza(){
            const intervaloDeFrames = 20;
            const passouIntervalo = frames % intervaloDeFrames === 0

            if(passouIntervalo){
                placar.pontuacao ++
            }
        }
    }
    return placar
}


//
// [Telas]
//
const globais = {}
let telaAtiva ={}
function mudaParaTela(novaTela){
    telaAtiva = novaTela
    if(telaAtiva.inicializa){
        telaAtiva.inicializa()
    }
}

const Telas = {
    INICIO: {
        inicializa(){
            globais.flappyBird = criaFlappyBird()
            globais.chao = criaChao()
            globais.canos = criaCanos()
        },
        desenha(){
            planoDeFundo.desenha()
            globais.flappyBird.desenha()
            globais.canos.desenha()
            globais.chao.desenha()
            mensagemGetReady.desenha()
        },
        click(){
            mudaParaTela(Telas.JOGO)
        },
        atualiza(){
            globais.chao.atualiza()
            globais.canos.atualiza()
        }
    }
}
Telas.JOGO = {
    inicializa(){
        globais.placar = criaPlacar();
    },
    desenha(){
        planoDeFundo.desenha()
        globais.flappyBird.desenha()
        globais.canos.desenha()
        globais.chao.desenha()
        globais.placar.desenha()
    },
    click(){
        globais.flappyBird.pula()
    },
    atualiza(){
        globais.flappyBird.atualiza()
        globais.chao.atualiza()
        globais.canos.atualiza()
        globais.placar.atualiza()
    }
}
Telas.GAME_OVER = {
    desenha(){
        mensagemGameOver.desenha()
    },
    click(){
        mudaParaTela(Telas.INICIO)
    },
    atualiza(){}
}

/* O desenho dos elementos várias vezes por segundo(FPS)
A função requestAnimationFrame() ajuda a desenhar os quadros na tela da forma mais inteligente possível
A função loop vai ficar desenhando os elementos na imagem de forma infinita */
function loop(){

    telaAtiva.desenha()
    telaAtiva.atualiza() 

    frames++
    requestAnimationFrame(loop)
}

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click()
    }
})

mudaParaTela(Telas.INICIO)
loop()