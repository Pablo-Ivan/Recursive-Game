/**********************************/
/*       Pablo Iván G. Soto       */
/*              2015              */
/**********************************/
var JUGADOR = {
  HUMANO: 1,
  CPU: 2
};
var ESTADO = {
  JUGANDO: 0,
  ESPERANDO: 1,
  TERMINADO: 2
};
function Tablero() {
  this.panel = [
  ];
  this.celdas = [
  ];
  for (var i = 0; i < 9; i++)
  {
    this.celdas[i] = document.getElementById('celda' + (i + 1));
  }
}
Tablero.prototype.reset = function () {
  this.panel = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ];
};
Tablero.prototype.marcable = function (posicion) {
  return (this.panel[posicion] == 0);
};
Tablero.prototype.marcar = function (turno, posicion) {
  this.panel[posicion] = turno;
};
Tablero.prototype.dibujar = function () {
  var n = this.panel.length;
  for (var i = 0; i < n; i++)
  {
    if (this.panel[i] == 0)
    {
      this.celdas[i].innerHTML = '';
    } 
    else
    {
      this.celdas[i].innerHTML = '<span style="color:' + ((this.panel[i] == JUGADOR.HUMANO) ? 'red' : 'blue') + ';">' + ((this.panel[i] == JUGADOR.HUMANO) ? 'X' : 'O') + '</span>';
    }
  }
};
Tablero.prototype.esGanador = function (jugador) {
  //HORIZONTAL
  var bool = (this.panel[0] == jugador && this.panel[1] == jugador && this.panel[2] == jugador);
  bool = bool || (this.panel[3] == jugador && this.panel[4] == jugador && this.panel[5] == jugador);
  bool = bool || (this.panel[6] == jugador && this.panel[7] == jugador && this.panel[8] == jugador);
  //VERTICAL
  bool = bool || (this.panel[0] == jugador && this.panel[3] == jugador && this.panel[6] == jugador);
  bool = bool || (this.panel[1] == jugador && this.panel[4] == jugador && this.panel[7] == jugador);
  bool = bool || (this.panel[2] == jugador && this.panel[5] == jugador && this.panel[8] == jugador);
  //DIAGONAl
  bool = bool || (this.panel[0] == jugador && this.panel[4] == jugador && this.panel[8] == jugador);
  bool = bool || (this.panel[2] == jugador && this.panel[4] == jugador && this.panel[6] == jugador);
  return bool;
};
Tablero.prototype.celdasVacias = function () {
  var n = this.panel.length;
  for (var i = 0; i < n; i++)
  {
    if (this.panel[i] == 0)
    {
      return true;
    }
  }
  return false;
};
function Juego() {
  this.partidas = 0;
  this.tablero = new Tablero();
  this.estado = null;
  this.consola = document.getElementById('consola');
  this.reset();
}
Juego.prototype.reset = function () {
  this.tablero.reset();
  if (this.partidas % 2 == 1)
  {
    this.estado = ESTADO.ESPERANDO;
    this.mostrarMensaje('Turno del jugador 2', 'blue');
    this.tablero.marcar(JUGADOR.CPU, Math.floor(Math.random() * 9));
  }
  this.partidas++;
  this.estado = ESTADO.JUGANDO;
  this.mostrarMensaje('Player 1 has a turn, 'red');
  this.tablero.dibujar();
};
Juego.prototype.logica = function (posicion) {
  if (this.estado == ESTADO.JUGANDO)
  {
    if (this.tablero.marcable(posicion))
    {
      this.tablero.marcar(JUGADOR.HUMANO, posicion);
      if (this.tablero.esGanador(JUGADOR.HUMANO))
      {
        this.estado = ESTADO.TERMINADO;
        this.mostrarMensaje('You win!<br/>Click a cell for starting again.', 'red');
        console.log("Yeah...you've actually won,");
      } 
      else if (!this.tablero.celdasVacias())
      {
        this.estado = ESTADO.TERMINADO;
        this.mostrarMensaje('Tie!<br/>Click a cell for starting again.', 'orange');
      } 
      else
      {
        this.estado == ESTADO.ESPERANDO;
        this.mostrarMensaje('AI has a turn...', 'blue');
        this.movimientoAI();
        if (this.tablero.esGanador(JUGADOR.CPU))
        {
          this.estado = ESTADO.TERMINADO;
          this.mostrarMensaje('AI wins!<br/>Click a cell for starting again.', 'blue');
        } 
        else if (!this.tablero.celdasVacias())
        {
          this.estado = ESTADO.TERMINADO;
          this.mostrarMensaje('Tie!<br/>Click a cell for starting again.', 'orange');
        } 
        else
        {
          this.mostrarMensaje('Player 1 has a turn', 'red');
          this.estado == ESTADO.JUGANDO;
        }
      }
    }
    this.tablero.dibujar();
  } 
  else if (this.estado == ESTADO.TERMINADO)
  {
    this.reset();
  }
};
Juego.prototype.mostrarMensaje = function (mensaje, color) {
  this.consola.innerHTML = '<span style="color:' + color + ';">' + mensaje + '</span>';
};
Juego.prototype.movimientoAI = function () {
  var posicion = 0;
  var n = this.tablero.panel.length;
  var aux,
  mejor = - 9999;
  for (var i = 0; i < n; i++)
  {
    if (this.tablero.marcable(i))
    {
      this.tablero.marcar(JUGADOR.CPU, i);
      aux = this.min();
      if (aux > mejor)
      {
        mejor = aux;
        posicion = i;
      }
      this.tablero.marcar(0, i);
    }
  }
  this.tablero.marcar(JUGADOR.CPU, posicion);
};
Juego.prototype.max = function () {
  if (this.tablero.esGanador(JUGADOR.HUMANO)) return - 1;
  if (!this.tablero.celdasVacias()) return 0;
  var n = this.tablero.panel.length;
  var aux,
  mejor = - 9999;
  for (var i = 0; i < n; i++)
  {
    if (this.tablero.marcable(i))
    {
      this.tablero.marcar(JUGADOR.CPU, i);
      aux = this.min();
      if (aux > mejor)
      {
        mejor = aux;
      }
      this.tablero.marcar(0, i);
    }
  }
  return mejor;
};
Juego.prototype.min = function () {
  if (this.tablero.esGanador(JUGADOR.CPU)) return 1;
  if (!this.tablero.celdasVacias()) return 0;
  var n = this.tablero.panel.length;
  var aux,
  mejor = 9999;
  for (var i = 0; i < n; i++)
  {
    if (this.tablero.marcable(i))
    {
      this.tablero.marcar(JUGADOR.HUMANO, i);
      aux = this.max();
      if (aux < mejor)
      {
        mejor = aux;
      }
      this.tablero.marcar(0, i);
    }
  }
  return mejor;
};
window.onload = function () {
  var juego = new Juego();
  var celdas = document.getElementsByClassName('celda');
  for (var i = 0; i < celdas.length; i++) {
    celdas[i].onclick = function (e) {
      juego.logica(parseInt(this.getAttribute('celda')));
    };
  }
};
