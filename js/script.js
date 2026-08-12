const link = "https://buy.stripe.com/test_dRm9AMg3C4lzedN8NYc7u00";
const payButton = document.getElementById ("botondePago");
payButton.addEventListener("click", ()=>{
    alert("redirigiendo a la pasarela de pago");
    window.location.href = link;
});
