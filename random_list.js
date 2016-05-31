<script type="text/javascript" src="sujeto.js"></script>
<script type="text/javascript" src="adjetivo.js"></script>
<script type="text/javascript" src="verbo.js"></script>
<script type="text/javascript" src="complemento.js"></script>

var count = 100;
function show() {
    random_sujeto = sujeto[(Math.floor(Math.random()*100))%sujeto.length]
    random_adjetivo = adjetivo[(Math.floor(Math.random()*100))%adjetivo.length]
    random_verbo = verbo[(Math.floor(Math.random()*100))%verbo.length]
    random_complemento = complemento[(Math.floor(Math.random()*100))%complemento.length]
    $("#randomlist").html(random_sujeto+" "+random_adjetivo+" "+random_verbo+" "+random_complemento);
}
$(document).ready(function() {
    show();
});
