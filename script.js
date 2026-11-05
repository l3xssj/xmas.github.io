'use strict';
const $=id=>document.getElementById(id),rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* Cielo: estrellas y nieve muy sutil */
const cv=$('cielo'),cx=cv.getContext('2d');let W,H,P=[],S=[];
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;
P=Array.from({length:W<600?45:90},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.4,v:Math.random()*.4+.15,o:Math.random()*.5+.25}));
S=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*H*.8,r:Math.random()*1.1+.3,f:Math.random()*6}))}
function draw(t){cx.clearRect(0,0,W,H);cx.fillStyle='#fff6dc';
for(const s of S){cx.globalAlpha=.35+.35*Math.sin(t/900+s.f);cx.fillRect(s.x,s.y,s.r,s.r)}
cx.fillStyle='#fff';
for(const p of P){cx.globalAlpha=p.o;cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.3);cx.fill();
if(!rm){p.y+=p.v;p.x+=Math.sin(t/2000+p.r)*.2;if(p.y>H){p.y=-4;p.x=Math.random()*W}}}
if(!rm&&!document.hidden)requestAnimationFrame(draw)}
size();draw(0);addEventListener('resize',()=>{size();if(rm)draw(0)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!rm)requestAnimationFrame(draw)});
/* Guirnalda: bombillas a lo largo de un trazo, se encienden al verse */
function bombillas(svg){const p=svg.querySelector('[data-p]'),n=+svg.dataset.g,L=p.getTotalLength(),B=[];
for(let i=0;i<n;i++){const q=p.getPointAtLength(L*(i+.5)/n),c=document.createElementNS('http://www.w3.org/2000/svg','circle');
c.setAttribute('cx',q.x);c.setAttribute('cy',q.y);c.setAttribute('r',svg.dataset.r||5);svg.appendChild(c);B.push(c)}
new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){B.forEach((c,i)=>setTimeout(()=>c.classList.add('on'),rm?0:i*130));o.disconnect()}},{threshold:.4}).observe(svg)}
bombillas(document.querySelector('#c1 svg'));
/* Cronología: cada año se enciende al llegar */
const ioA=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('on')),{threshold:.6});
document.querySelectorAll('.año').forEach(a=>ioA.observe(a));
/* Sorpresa: la bombilla apagada */
$('foco').onclick=()=>{$('foco').classList.add('on');$('secreto').textContent='Esta se enciende el día de nuestro primer abrazo.'};
/* Universo: constelación */
const E=[['Instagram',14,14,'Por aquí empezó todo entre nosotros.'],['Discord',42,8,'Ahí empezamos a hablar cada vez más.'],['Fortnite',74,16,'Una de las primeras cosas que jugamos juntos.'],['Rocket League',82,40,'Otro juego que nos dio un montón de buenos ratos.'],['Las llamadas',64,36,'Me encanta tenerte al otro lado, aunque haya más de 800 kilómetros.'],['Las conversaciones',36,32,'Contigo puedo hablar de prácticamente cualquier cosa.'],['Los consejos',12,52,'Los que me das y los que intento devolverte.'],['Las tonterías',40,60,'De estas no nos faltan, por suerte.'],['La confianza',74,68,'Me hace muy feliz poder contar contigo así.'],['Nuestra música',50,90,'Dos gustos distintos y un montón de canciones en común.']];
const C=$('cons');C.innerHTML='<svg viewBox="0 0 100 110" aria-hidden="true"><polyline points="'+E.map(e=>e[1]+','+e[2]*1.1).join(' ')+'"/></svg>';
E.forEach(e=>{const b=document.createElement('button');b.type='button';b.className='est';b.textContent=e[0];b.style.left=e[1]+'%';b.style.top=e[2]+'%';
b.onclick=()=>{C.querySelectorAll('.est').forEach(x=>x.removeAttribute('aria-pressed'));b.setAttribute('aria-pressed','true');$('nota').textContent=e[3]};C.appendChild(b)});
/* Museo: objetos basados únicamente en vuestra historia compartida. */
const objetosMuseo=[
  ['✉','Instagram','Por aquí empezamos a hablar después de conocernos a través de una amiga tuya. No sé en qué momento dejó de ser una conversación cualquiera, pero me alegro de que siguiéramos hablando.'],
  ['◉','Discord','Más adelante nos pasamos a Discord y empezamos a compartir todavía más ratos. También forma parte de cómo fue creciendo lo nuestro.'],
  ['◆','Fortnite','Una de esas partidas que se convirtieron en parte de nuestra historia. No hace falta que cada recuerdo sea enorme para que me guste tenerlo aquí.'],
  ['⚽','Rocket League','Otro juego que hemos compartido durante estos años. Lo pongo en esta vitrina porque también habla de todo ese tiempo juntos.'],
  ['♫','Las llamadas','A más de 800 kilómetros, nuestras llamadas han sido otra forma de acompañarnos y contarnos cosas.'],
  ['⌖','El mapa','Cáceres y Cataluña quedan lejos en el mapa, pero la distancia no borra todo lo que hemos construido hablando y compartiendo.'],
  ['▱','La maleta','No tiene un destino ni una fecha. Solo representa esos planes que algún día podremos hacer, como viajar juntos si se da la oportunidad.'],
  ['✦','La estrella','La dejo al final porque nuestra historia no se queda en lo que ya pasó. Me hace ilusión todo lo que todavía nos queda por vivir.']
];
const museo=$('museo');
objetosMuseo.forEach(([icono,titulo,texto],i)=>{const b=document.createElement('button');b.type='button';b.className='objeto-museo';b.innerHTML=`<span aria-hidden="true">${icono}</span><strong>${titulo}</strong><small>${String(i+1).padStart(2,'0')} · abrir ficha</small>`;b.onclick=()=>{$('ficha-museo').innerHTML=`<span class="ficha-sello" aria-hidden="true">${icono}</span><div><h3>${titulo}</h3><p>${texto}</p></div>`;museo.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true')};museo.appendChild(b)});
/* Cartas para distintos momentos; los favoritos solo se guardan en este navegador. */
const cartasCalidas=[
  ['Para un día complicado','Si hoy se te está haciendo cuesta arriba, no hace falta que encuentres las palabras perfectas. Me puedes escribir tal cual, aunque solo sea para soltar un poco lo que llevas encima.'],
  ['Para desconectar un rato','Deja lo que tengas entre manos un momento, ponte algo que te apetezca y respira. No tienes que resolverlo todo ahora mismo, neni.'],
  ['Para echarte unas risas','No tengo un chiste preparado que vaya a cambiarte la vida, así que te recuerdo algo más fiable: todavía nos debemos muchas tonterías y partidas.'],
  ['Para cuando me eches de menos','Yo también tengo ganas de que algún día podamos compartir un rato sin una pantalla. Mientras tanto, aquí sigo, a un mensaje de distancia.'],
  ['Para acordarte de lo nuestro','Empezamos a hablar en 2020 y, sin planearlo, acabaste siendo alguien muy importante para mí. Me gusta que sigamos sumando años a nuestra manera.'],
  ['Para abrir porque sí','No necesitas una razón especial para leer esto: me alegro de tenerte en mi vida, Ale. Eso era todo; puedes seguir con lo tuyo.']
];
const favKey='regaloAle.cartasFavoritas';let cartasFavoritas=new Set();
try{cartasFavoritas=new Set(JSON.parse(localStorage.getItem(favKey)||'[]'))}catch{}
const cartasPanel=$('cartas-chimenea');
cartasCalidas.forEach(([titulo,texto],i)=>{const b=document.createElement('button');b.type='button';b.className='carta-opcion';b.innerHTML=`<span aria-hidden="true">✉</span><strong>${titulo}</strong><small>${cartasFavoritas.has(i)?'★ Guardada':'Abrir carta'}</small>`;b.onclick=()=>{$('carta-chimenea').innerHTML=`<div class="carta-interior"><span class="carta-sello" aria-hidden="true">✦</span><h3>${titulo}</h3><p>${texto}</p><button type="button" class="guardar-carta" aria-pressed="${cartasFavoritas.has(i)}">${cartasFavoritas.has(i)?'★ Quitar de favoritas':'☆ Guardar en favoritas'}</button></div>`;$('carta-chimenea').querySelector('.guardar-carta').onclick=ev=>{if(cartasFavoritas.has(i))cartasFavoritas.delete(i);else cartasFavoritas.add(i);try{localStorage.setItem(favKey,JSON.stringify([...cartasFavoritas]))}catch{};const saved=cartasFavoritas.has(i);ev.currentTarget.textContent=saved?'★ Quitar de favoritas':'☆ Guardar en favoritas';ev.currentTarget.setAttribute('aria-pressed',String(saved));b.querySelector('small').textContent=saved?'★ Guardada':'Abrir carta'};cartasPanel.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true')};cartasPanel.appendChild(b)});
/* Deseo opcional, guardado localmente y nunca enviado a un servidor. */
const deseoInput=$('deseo-ale'),deseoKey='regaloAle.deseo';
try{deseoInput.value=localStorage.getItem(deseoKey)||''}catch{}
$('form-deseo').onsubmit=e=>{e.preventDefault();const texto=deseoInput.value.trim();if(!texto){$('estado-deseo').textContent='Escribe algo si te apetece guardarlo; no hace falta rellenarlo.';return}try{localStorage.setItem(deseoKey,texto);$('estado-deseo').textContent='Listo, se ha quedado guardado en este navegador. No se ha enviado.'}catch{$('estado-deseo').textContent='Este navegador no permite guardarlo ahora mismo, pero puedes dejarlo escrito aquí.'}};
$('borrar-deseo').onclick=()=>{deseoInput.value='';try{localStorage.removeItem(deseoKey)}catch{};$('estado-deseo').textContent='He borrado el deseo guardado en este navegador.'};
/* Navegación por capítulos (se genera sola con las secciones que existan) */
function nav(){const n=$('nav'),S=document.querySelectorAll('main>section[data-t]');n.innerHTML='';
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)n.querySelectorAll('a').forEach(a=>a.classList.toggle('act',a.hash==='#'+x.target.id))}),{threshold:.5});
S.forEach(s=>{const a=document.createElement('a');a.href='#'+s.id;a.title=s.dataset.t;a.setAttribute('aria-label',s.dataset.t);n.appendChild(a);io.observe(s)})}
/* Música de fondo: reproductor oficial de YouTube; el audio no empieza antes del primer toque. */
const VIDEO_ID='YTRupZm8Zjg';let player=null,apiCargando=false,quiereMusica=false,sonidoActivo=true;
function crearPlayer(){
  if(!quiereMusica||player||!window.YT)return;
  player=new YT.Player('yt-player',{width:'200',height:'200',videoId:VIDEO_ID,
    playerVars:{autoplay:1,controls:1,playsinline:1,loop:1,playlist:VIDEO_ID,rel:0,enablejsapi:1},
    events:{
      onReady:e=>{e.target.setVolume(+$('volumen').value);e.target.unMute();e.target.playVideo()},
      onStateChange:e=>{if(e.data===1){$('play-music').textContent='Ⅱ';$('play-music').setAttribute('aria-label','Pausar música');$('music-status').textContent='La música está sonando'}else if(e.data===2){$('play-music').textContent='▶';$('play-music').setAttribute('aria-label','Reanudar música');$('music-status').textContent='La música está pausada'}},
      onAutoplayBlocked:()=>{$('music-status').textContent='Pulsa Activar música para empezar a escucharla';$('play-music').textContent='▶';$('play-music').setAttribute('aria-label','Activar música')},
      onError:()=>{$('music-status').textContent='No se ha podido cargar la canción. Puedes probar de nuevo con el control de música';$('play-music').textContent='▶';$('play-music').setAttribute('aria-label','Reintentar música')}
    }
  });
}
function cargarApiYouTube(){
  if(apiCargando)return;apiCargando=true;
  window.onYouTubeIframeAPIReady=crearPlayer;
  const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.async=true;document.head.appendChild(s);
}
function iniciarMusica(){ $('musica').hidden=false;quiereMusica=true;crearPlayer(); }
cargarApiYouTube();
$('play-music').onclick=()=>{if(!player)return;if(player.getPlayerState()===1){player.pauseVideo();$('play-music').textContent='▶';$('play-music').setAttribute('aria-label','Reanudar música')}else{player.playVideo();$('play-music').textContent='Ⅱ';$('play-music').setAttribute('aria-label','Pausar música')}};
$('mute-music').onclick=()=>{if(!player)return;sonidoActivo=!sonidoActivo;if(sonidoActivo){player.unMute();$('mute-music').setAttribute('aria-label','Silenciar música')}else{player.mute();$('mute-music').setAttribute('aria-label','Activar sonido')}};
$('volumen').oninput=e=>{if(player){player.setVolume(+e.target.value);if(+e.target.value===0)player.mute();else if(sonidoActivo)player.unMute()}};
/* Apertura del regalo */
$('abrir').onclick=()=>{iniciarMusica();const b=document.body;b.classList.add('abriendo');
setTimeout(()=>{b.classList.remove('cerrado','abriendo');nav();
document.querySelectorAll('#c4 svg[data-g]').forEach(bombillas);
const t=$('c2');t.scrollIntoView({behavior:rm?'auto':'smooth'});t.querySelector('h2').focus({preventScroll:true})},rm?0:1100)};
/* Capítulo 5: archivo de mensajes (textos tal cual, sin corregir) */
const T=(f,t,s)=>`<div class="tarj"><time>${f}</time>${s?`<small>${s}</small>`:''}${[].concat(t).map(x=>`<p>«${x}»</p>`).join('')}</div>`;
$('deLex').innerHTML=[['23/04/2025','Para ti bb','Un dibujo con rosas'],['23/04/2025','mi rosa para ute’'],['02/02/2025','tienes tantas emociones y energías en ese cuerpito'],['20/11/2024','serías mi trocito de cora fav'],['19/11/2024','siempre estará esa miniale conmigo']].map(a=>T(...a)).join('');
$('deAle').innerHTML=[['01/09/2026','LEX ERES DE LO MEJOR QUE TENGO EN MI VIDA'],['24/06/2026','Que eres mi cable a tierra de la España que pronuncia letras sabes'],['14/06/2026',['MÁS DE LO QIE PIENSAS','TE QUIERO UN MONTÓN','MUCHÍSIMAS GRACIAS']],['03/05/2026','o sea yo acudía (aún lo hago eh) a ti para cualquier mierda, cualquier cosas ahí estaba yo para preguntarte'],['14/03/2026','es que para mí eres eso, mi día a día, te lo cuento todo'],['28/02/2026','Y me alegro que más gente se de cuenta de la suerte que tengo yo, de tenerte a mi lado'],['07/01/2026','Ni tú tampoco te haces a la idea de lo que significas para mí… hemos creado algo tan real y tan bonito cuando realmente es imposible, porque a distancia las cosas son más complicadas, que a día de hoy me conoces mejor que alguien que está IRL','En respuesta a: «es que tu no te puedes hacer a la idea de lo importante que eres para mi»'],['21/10/2025',['Y ojalá lo viera todo el mundo','No te menos precies tu','Y CLARO QUE ERES EL MEJOR']]].map(a=>T(...a)).join('');
/* Capítulo 8: la carta */
$('sobre').onclick=e=>{$('carta').classList.add('abierta');e.currentTarget.setAttribute('aria-expanded','true');$('papel').focus()};
/* Calendario: doce mensajes que Ale puede abrir en el orden que quiera. */
const sorpresas=[
['Un deseo de Navidad','Ojalá estas fiestas te dejen descansar, reírte mucho y estar con gente que te haga sentir bien.'],
['Desde 2020','Me sigue haciendo gracia pensar que todo empezó por una amiga tuya y que, sin buscarlo, acabaste siendo alguien tan importante para mí.'],
['Nuestra música','Tú con Marina y Alba Reche, yo con YSY A y Duki, y una playlist compartida en medio. Me gusta mucho esa mezcla tan nuestra.'],
['Una cosa que valoro','Me gusta que contigo puedo hablar con confianza y ser yo, incluso cuando no tengo nada especialmente interesante que contar.'],
['Una pequeña verdad','Seis años después seguimos encontrando cosas de las que hablar. No está nada mal para dos personas que empezaron hablando por Instagram.'],
['Un plan pendiente','Algún día nos tocará cambiar las llamadas por una conversación en persona. Sin prisa, pero con muchas ganas.'],
['Por si se te olvida','Eres una parte muy importante de mi vida, Ale. No hace falta que hagas nada especial para que sea así.'],
['Un abrazo desde aquí','Te mando uno de esos abrazos que no llegan por la pantalla, pero que van con todo el cariño igualmente.'],
['Para escuchar','Te dejo nuestra playlist a mano por si hoy te apetece poner algo de música y dejar que suene.'],
['Para el año que viene','Ojalá tengas un año con ratos tranquilos, cosas que te ilusionen y más motivos para reírte de los que puedas contar.'],
['Un secreto pequeño','Aunque estemos lejos, muchas veces formas parte de mi día a día más de lo que probablemente imaginas.'],
['El regalo de verdad','Lo mejor de todo esto no es la página: es tener una amistad que empezó en 2020 y que todavía sigue sumando capítulos.']
];
const calendario=$('calendario'),cajaSorpresa=$('sorpresa-abierta'),descubiertas=new Set();
sorpresas.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='dia-sorpresa';b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label',`Abrir sorpresa ${i+1}`);b.onclick=()=>{descubiertas.add(i);b.classList.add('descubierta');b.setAttribute('aria-pressed','true');$('contador-sorpresas').textContent=descubiertas.size;$('sorpresa-numero').textContent=`Sorpresa ${i+1} de 12`;$('sorpresa-titulo').textContent=s[0];$('sorpresa-texto').textContent=s[1];cajaSorpresa.hidden=false};calendario.appendChild(b)});
$('cerrar-sorpresa').onclick=()=>{cajaSorpresa.hidden=true};
/* Adornos del árbol: mensajes breves basados en vuestra historia real. */
const mensajesArbol=['Desde Instagram hasta aquí, me alegro mucho de que empezáramos a hablar.','Discord guarda una parte muy nuestra de estos años.','Las partidas de Fortnite también forman parte de nuestra historia.','Rocket League: otra excusa estupenda para compartir un rato.','Me gusta que nuestras llamadas puedan convertir un día normal en uno mejor.','Seis años después, aquí seguimos, y eso me hace mucha ilusión.'];
const adornosVistos=new Set();
document.querySelectorAll('.adorno').forEach((b,i)=>b.onclick=()=>{$('mensaje-arbol').textContent=mensajesArbol[i];b.classList.add('iluminado');adornosVistos.add(i);if(adornosVistos.size===mensajesArbol.length)$('mensaje-arbol').textContent='Y si junto todas estas luces, lo que queda es esto: me alegro muchísimo de que seas parte de mi vida, Ale.'});
/* Mensajes para volver cuando apetezca. */
const mensajitos=['Si hoy ha sido un día de esos, no hace falta que me lo cuentes perfecto. Escríbeme como te salga.','No tienes que poder con todo a la vez, neni. Si te apetece hablar, aquí estoy.','Te mando una distracción en forma de recordatorio: tenemos una playlist para poner cualquier cosa y desconectar un rato.','Me alegra que hoy estés contenta. Disfrútalo mucho, que te lo mereces.','Si te entran dudas, acuérdate de que no tienes que resolverlo todo ahora mismo. Podemos hablarlo cuando quieras.','No estás sola con lo que te pase, peque. Aunque estemos lejos, puedes escribirme.','Vengo a recordarte que eres muy graciosa y que nuestras tonterías tienen bastante mérito.','Si echas de menos tenerme cerca, yo también tengo ganas de que algún día podamos compartir tiempo sin una pantalla.','Un empujoncito pequeño: ve paso a paso, que no tienes que llegar a todo hoy.','Por aquí sigue tu bestie, a un mensaje de distancia.'];
$('otro-mensaje').onclick=()=>{let i=Math.floor(Math.random()*mensajitos.length);if(mensajitos.length>1&&$('tarjeta-mensaje').dataset.ultimo===String(i))i=(i+1)%mensajitos.length;$('tarjeta-mensaje').dataset.ultimo=i;$('tarjeta-mensaje').textContent=mensajitos[i]};

/* Película breve controlable: funciona sin recursos externos ni bloquear el resto del regalo. */
const escenasCine=[
  ['Una noche de diciembre','La ciudad está tranquila, las ventanas empiezan a encenderse y por aquí también guardo una sorpresa para ti.'],
  ['Dos lugares','Tú en Cáceres y yo en Cataluña. Cada uno en su sitio, con más de 800 kilómetros entre medias.'],
  ['Una conexión','Con el tiempo, entre mensajes, llamadas y partidas, fuimos haciendo un hueco para el otro en el día a día.'],
  ['Cosas que ya son nuestras','Instagram, Discord, Fortnite, Rocket League y todas esas conversaciones que fueron haciendo camino.'],
  ['Lo que sigue','No sé qué será lo próximo que compartamos, pero me hace ilusión que todavía queden historias por estrenar. Feliz Navidad, Ale.']
];
let escenaActual=0,relojCine=null;
function pintarEscena(){const escena=escenasCine[escenaActual];$('cine-numero').textContent=`Escena ${escenaActual+1} de ${escenasCine.length}`;$('cine-titulo').textContent=escena[0];$('cine-texto').textContent=escena[1];$('escena-cine').className=`escena-cine escena-${escenaActual}`}
function detenerCine(mensaje){clearInterval(relojCine);relojCine=null;$('cine-pausar').disabled=true;$('cine-reproducir').textContent=escenaActual===escenasCine.length-1?'Volver a ver':'Continuar';$('cine-estado').textContent=mensaje}
function avanzarCine(){if(escenaActual<escenasCine.length-1){escenaActual++;pintarEscena()}else detenerCine('Fin de la película. Si te apetece, puedes volver a verla.')}
$('cine-reproducir').onclick=()=>{if(relojCine)return;if(escenaActual===escenasCine.length-1){escenaActual=0;pintarEscena()}$('cine-pausar').disabled=false;$('cine-reproducir').textContent='En reproducción…';$('cine-estado').textContent='La película sigue; puedes pausarla o saltar de escena.';relojCine=setInterval(avanzarCine,4200)};
$('cine-pausar').onclick=()=>{if(relojCine){clearInterval(relojCine);relojCine=null;$('cine-pausar').textContent='Continuar';$('cine-reproducir').textContent='Reanudar';$('cine-estado').textContent='Pausada. Puedes continuar desde cualquiera de los dos controles.'}else{$('cine-pausar').textContent='Pausar';$('cine-reproducir').click()}};
$('cine-saltar').onclick=()=>{if(!relojCine){if(escenaActual<escenasCine.length-1){escenaActual++;pintarEscena();$('cine-estado').textContent='Has pasado a la escena siguiente.'}return}avanzarCine()};
$('cine-reiniciar').onclick=()=>{clearInterval(relojCine);relojCine=null;escenaActual=0;pintarEscena();$('cine-pausar').textContent='Pausar';$('cine-pausar').disabled=true;$('cine-reproducir').textContent='Ver la película';$('cine-estado').textContent='Dura unos segundos y puedes pararla cuando quieras.'};

/* Relato ramificado independiente: las rutas cambian, todos los finales son cálidos. */
const relatoNodos={
  inicio:{texto:'Al salir a dar una vuelta, Ale ve que una hilera de luces navideñas dobla por una calle que no había mirado antes. ¿Qué hace?',opciones:[['Entrar en una tienda que sigue abierta','tienda'],['Seguir las luces por la calle','luces'],['Pararse a escuchar una canción que viene de una ventana','ventana']]},
  tienda:{texto:'Dentro hay adornos hechos a mano y una campanilla que suena cada vez que se abre la puerta. La dependienta le enseña una caja de piezas de colores.',opciones:[['Elegir una pieza dorada','final-creativo'],['Preguntar por las luces de la calle','cruce']]},
  luces:{texto:'Las luces llevan hasta una placita pequeña. No hay nadie, solo nieve suave y varias ventanas encendidas.',opciones:[['Mirar qué hay al otro lado de la plaza','cruce'],['Sentarse un minuto y disfrutar del silencio','final-calma']]},
  ventana:{texto:'La canción termina justo cuando una estrella cruza el cielo. Desde la ventana, alguien deja una lámpara encendida.',opciones:[['Seguir la dirección de la estrella','cruce'],['Quedarse un poco más escuchando','final-musica']]},
  cruce:{texto:'Las tres calles vuelven a encontrarse en el mismo sitio. Parece que esta noche tenía ganas de que Ale llegara hasta aquí.',opciones:[['Seguir el camino iluminado','final-luces'],['Volver a casa con una historia nueva','final-casa']]},
  'final-creativo':{texto:'La pieza dorada encaja en el adorno y refleja las luces de la tienda. Ale se lo lleva como recuerdo de una noche que empezó por pura curiosidad. Y yo me quedo con esta idea: algunas cosas bonitas empiezan así, sin planearlas.',final:true},
  'final-calma':{texto:'Ale se queda un rato mirando cómo cae la nieve. No pasa nada extraordinario, y justo por eso la noche se siente bien. A veces un momento tranquilo ya es un plan estupendo.',final:true},
  'final-musica':{texto:'La canción se queda un rato dando vueltas en la cabeza mientras Ale vuelve a casa. Hay noches que mejoran con una melodía y sin ninguna prisa.',final:true},
  'final-luces':{texto:'El camino termina en un pequeño mirador desde el que se ven todas las ventanas encendidas. La ciudad parece menos grande cuando se mira con calma.',final:true},
  'final-casa':{texto:'De vuelta en casa, Ale guarda la historia de esa vuelta inesperada. No era una gran aventura, pero sí una de esas noches que dejan buen cuerpo.',final:true}
};
function mostrarRelato(clave){const n=relatoNodos[clave];$('relato-texto').textContent=n.texto;$('relato').querySelector('.relato-capitulo').textContent=n.final?'Final de esta ruta':'Una noche cualquiera';const cont=$('relato-opciones');cont.replaceChildren();if(n.final){const p=document.createElement('p');p.className='relato-dedicatoria';p.textContent='Y colorín colorado no, que todavía nos quedan un montón de cosas por vivir. Esta aventura solo era una excusa para regalarte un rato distinto, Ale.';cont.appendChild(p);return}n.opciones.forEach(([etiqueta,siguiente])=>{const b=document.createElement('button');b.type='button';b.className='opcion-relato';b.textContent=etiqueta;b.onclick=()=>mostrarRelato(siguiente);cont.appendChild(b)})}
mostrarRelato('inicio');$('relato-reiniciar').onclick=()=>mostrarRelato('inicio');

/* Taller de copos SVG-like en Canvas: vista previa, guardado local y PNG real. */
const lienzoCopo=$('lienzo-copo'),ctxCopo=lienzoCopo.getContext('2d'),brazosCopo=$('copo-brazos'),colorCopo=$('copo-color'),detalleCopo=$('copo-detalle');
const copoKey='regaloAle.copo';
function dibujarCopo(){const n=+brazosCopo.value,det=+detalleCopo.value,color=colorCopo.value,w=lienzoCopo.width,h=lienzoCopo.height,cx=w/2,cy=h/2,r=225;ctxCopo.clearRect(0,0,w,h);ctxCopo.save();ctxCopo.translate(cx,cy);ctxCopo.strokeStyle=color;ctxCopo.fillStyle=color;ctxCopo.lineWidth=2.4;ctxCopo.lineCap='round';ctxCopo.shadowColor=color;ctxCopo.shadowBlur=12;
  for(let i=0;i<n;i++){ctxCopo.save();ctxCopo.rotate(i*Math.PI*2/n);ctxCopo.beginPath();ctxCopo.moveTo(0,0);ctxCopo.lineTo(0,-r);ctxCopo.stroke();
    for(let j=1;j<=det;j++){const y=-r*(.24+j*.12),l=22+(det-j)*4;ctxCopo.beginPath();ctxCopo.moveTo(0,y);ctxCopo.lineTo(-l,y-l*.72);ctxCopo.moveTo(0,y);ctxCopo.lineTo(l,y-l*.72);ctxCopo.stroke()}
    ctxCopo.beginPath();ctxCopo.arc(0,-r,5+det,0,Math.PI*2);ctxCopo.fill();ctxCopo.restore()}
  ctxCopo.beginPath();ctxCopo.arc(0,0,10,0,Math.PI*2);ctxCopo.fill();ctxCopo.restore();$('copo-brazos-valor').value=n}
[brazosCopo,colorCopo,detalleCopo].forEach(x=>x.addEventListener('input',dibujarCopo));
try{const guardado=JSON.parse(localStorage.getItem(copoKey)||'null');if(guardado){brazosCopo.value=guardado.brazos;colorCopo.value=guardado.color;detalleCopo.value=guardado.detalles;$('estado-copo').textContent='He recuperado el último diseño guardado en este navegador.'}}catch{}
dibujarCopo();
$('guardar-copo').onclick=()=>{try{localStorage.setItem(copoKey,JSON.stringify({brazos:+brazosCopo.value,color:colorCopo.value,detalles:+detalleCopo.value}));$('estado-copo').textContent='Diseño guardado en este navegador. Puedes volver y seguir cambiándolo.'}catch{$('estado-copo').textContent='No se pudo guardar en este navegador, pero puedes descargar el PNG.'}};
$('descargar-copo').onclick=()=>{lienzoCopo.toBlob(blob=>{if(!blob){$('estado-copo').textContent='No se ha podido crear la imagen en este navegador.';return}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='copo-de-nieve-ale.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('estado-copo').textContent='Ya tienes tu copo descargado en PNG.'},'image/png')};
