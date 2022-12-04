# MyLittleLibrary

Just a bunch of custom functions for chattriggers

Try it out:

```javascript
import { getAllBlocksInRayTraceFromPlayer, drawMultipleBlocksInWorld, getEntityHit, getBlockHit } from '../MyLittleLibrary/index'

let myBlocks = new Set();

register('step', () => {
    myBlocks = getAllBlocksInRayTraceFromPlayer(64, true);

    let entity = getEntityHit(64, Tessellator.partialTicks);
    if (entity) {
        ChatLib.chat(entity);
    } else { ChatLib.chat('no entity'); }

    let block = getBlockHit(64, Tessellator.partialTicks);
    if (block) {
        ChatLib.chat(block.type.getName());
    } else { ChatLib.chat('no block'); }
}).setDelay(1);

register('renderWorld', () => {
    if(myBlocks.size > 0) {
        let blockLocations = [];
        myBlocks.forEach((block) => blockLocations.push([block.x, block.y, block.z]));
        drawMultipleBlocksInWorld(blockLocations, 1, 0, 0, 1, true);
    }
})
```
