// archivo-llamada.js

// Importar la función desde el archivo principal
import { iniciarActividadPronunciacion } from './vocabulary.js';

// Al cargar el DOM
  // Crear el contenedor donde se renderizará la actividad
  const contenedor = document.getElementById('si408');

  
  // Lista de palabras para la actividad (ejemplo con más de 10 palabras)
  const palabrasEnIngles = [
    {palabra:'apple',imagen:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTefUHgejxyLcdttT_ovpNnkWpHNzXHDsN9RQ&s'},
    {palabra:'house',imagen:'https://www.modularvivendi.com/wp-content/uploads/2019/10/WhatsApp-Image-2023-04-13-at-09.50.03.jpeg'},
    {palabra:'computer',imagen:'https://grafix.es/wp-content/uploads/2015/03/Dekstop-PC-1024x768-1.jpg'},
    {palabra:'book',imagen:'https://dical.es/modules/ph_simpleblog/covers/78.jpg'},
    {palabra:'water',imagen:'https://www.saguapac.com.bo/wp-content/uploads/2023/05/definicion-del-agua-saguapac.jpg'},
    {palabra:'phone',imagen:'https://distritooficina.com/wp-content/uploads/2023/12/shutterstock_205488442-1200x640.jpg'},
    {palabra:'chair',imagen:'https://m.media-amazon.com/images/I/716tq9Y8WOL._AC_SL1500_.jpg'},
    {palabra:'window',imagen:'https://www.anglianhome.co.uk/-/media/ahi/galleries/windows/cottage/white-upvc-casement-window-with-cottage-bars-exterior-in-open-position.jpg?w=900'},
    {palabra:'table',imagen:'https://moblebo.com/wp-content/uploads/2023/09/mesa_comedor_roble_macizo_diseno_tera_producto.jpg'},
    {palabra:'car',imagen:'https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&height=900&width=1600&fit=bounds'},
    {palabra:'pen',imagen:'https://www.faber-castell.com/-/media/Products/Product-Repository/Miscellaneous-ballpoint-pens/24-24-05-Ballpoint-pen/143499-Ballpoint-Pen-Basic-M-black/Images/143499_0_PM99.ashx?bc=ffffff&as=0&h=900&w=900&sc_lang=en-Glob&hash=39297B315D64AC3EF9FF2479FE18C876'},
    {palabra:'door',imagen:'https://www.energy.gov/sites/default/files/styles/full_article_width/public/door_5481543.jpg?itok=l_TeNrgh'},
    {palabra:'school',imagen:'https://engage-education.com/wp-content/uploads/2022/08/Private-School.jpg'},
    {palabra:'friend',imagen:'https://bumble.com/the-buzz/_next/image?url=http%3A%2F%2Fcdn-internal%3A8081%2Fbumble-buzz-production%2F2024%2F11%2Fshutterstock_1629473563-scaled-1-1.jpg&w=3840&q=75'},
    {palabra:'time',imagen:'https://as2.ftcdn.net/v2/jpg/01/03/04/57/1000_F_103045711_boZazdhiExJqp428eiYDZ9JAMOToc094.jpg'},
  ];
  
  // Iniciar la actividad de pronunciación
  iniciarActividadPronunciacion(contenedor,palabrasEnIngles);