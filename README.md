todo        
TEHTUD add enemy -> tilemap         
TEHTUD add flyingenemy.topright -> tilemap          
TEHTUD read enemy & flyingenemey positions from tilemap         
TEHTUD levelup & loselife, keyupi saatmine kui funktsiooni läheb, et ei jätkaks jooksmist vms<          

basicud mida oleks vaja:            
auto scale for screens smaller/equal than 1280x720p             
fps limit -> 60 fps     
finish level 3          

more enemies // praegu vist piisavalt, aga kui on ideid siis mida rohkem, seda uhkem        
add enemyjumping to enemymove // et koerad oleksid hirmsamad, kui ei viitsi siis kamakolm           

welcome screen -> choose language EST/FIN       
pause menu -> continue, restart, ja et loomad ka pausile paneks!            
death screen! VVVVV         
kui sured -> tuleb timer resetida           

KINDLASTI!!!            
peale levelivahetust salvestada mällu vaenlased kes jäid lömastamata!           
ja, et ta tagasi (ntx level2'st level1'te) liikudes ei respawniks neid!!!!!!!               
või siis kergemat vastupanuteed ja lihtsalt teeb checki, ntx et kui currentlevel != highestLevel siis ta ei joonista neid tõpraid           

IDEE:           
teha item slot, sinna saab seeni korjata ja siis level3's relvi?, et see lendav taldrik alla lasta!?                
max asju slotis võiks olla 1, space korral kasutab eset         
seene puhul teeb seda pulli, et reversib larrow ja rarrow mõneks ajaks ära          
ja relva puhul laseb taevasse, bossfightiks         


TEADAOLEVAD BUGID:          
createenemies()     
if (Math.random() <= 0.5) enemy.style.backgroundImage = `url("images/characters/villains/black_dog.gif")`       
        else enemy.style.backgroundImage = `url("images/characters/villains/brown_dog.gif")`            

see näiteks tekitab probleeme, if (e % 2 == 1) näiteks töötab ilusti, miskipärast random ajab selle for loopi seal lolliks?!    