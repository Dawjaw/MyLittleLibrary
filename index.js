/// <reference types="../CTAutocomplete" />

import { isVectorInAABB, drawNormalCube } from "./helper";

/**
 * Draws the frame of a box
 * @param {Number} distance maximum ray trace distance
 * @return {Set} A Set of Blocks encountered on the path
 */
export function getAllBlocksInRayTraceFromPlayer(distance) {
    let playerLookVector = Player.getPlayer().func_70040_Z();

    let xPlayer = Player.getLastX();
    let yPlayer = Player.getLastY() + Player.getPlayer().func_70047_e();
    let zPlayer = Player.getLastZ();

    let x = playerLookVector.field_72450_a;
    let y = playerLookVector.field_72448_b;
    let z = playerLookVector.field_72449_c;

    let start = 1;
    let add = 0.1
    let stop = (distance / add);

    let blockSet = new Set();

    let lastBlock = null;

    while (start < stop) {
        let thisBlock = World.getBlockAt(xPlayer + x * (add * start), yPlayer + y * (add * start), zPlayer + z * (add * start));
        let thisBlockString = `${thisBlock.x}, ${thisBlock.y}, ${thisBlock.z}`;
        if (lastBlock !== thisBlockString) {
            lastBlock = thisBlockString;
            blockSet.add(thisBlock);
        }
        start++;
    }
    return blockSet;
}


/**
 * Raytrace from player to the first entity in the way
 * @param {Number} distance maximum ray trace distance
 * @return {Entity} The first entity encountered on the path
 * @return {null} If no entity is encountered
 */
export function getEntityHit() {
    const entities = [];
    World.getAllEntities().forEach((entity) => {entities.push(entity)});
    entities.sort((a, b) => a.distanceTo(Player.getPlayer()) - b.distanceTo(Player.getPlayer()));
    for (const e of entities) {
        let entity = e.entity;
        let entityPositionEyes = entity.func_174824_e(Tessellator.partialTicks);
        let dir = entityPositionEyes.func_178788_d(Player.getPlayer().func_174824_e(Tessellator.partialTicks)).func_72432_b();
        let dot = dir.func_72430_b(Player.getPlayer().func_70040_Z());
        if (dot <= 0.98) continue;
        let raytrace = Player.getPlayer().func_174822_a(200, 1.0);
        if (raytrace.field_72313_a.toString() === "BLOCK") {
            let blockpos = raytrace.func_178782_a();
            if (Player.asPlayerMP().distanceTo(new BlockPos(blockpos)) < Player.asPlayerMP().distanceTo(e)) {
                continue;
            }
        }
        let aabbe = entity?.func_174813_aQ()?.func_72314_b(entity.func_70111_Y(), entity.func_70111_Y(), entity.func_70111_Y());
        
        if(isVectorInAABB(Player.getPlayer().func_70040_Z(), aabbe, Player, 100)) {
            return new Entity(entity);
        }
    }
    return;
}


/**
 * Raytrace from player to the first block in the way
 * @param {Number} distance maximum ray trace distance
 * @param {partialTicks} partialTicks partialTicks
 * @return {Block} Block The first block encountered on the path
 * @return {null} Null If no block is encountered
 */
export function getBlockHit(distance, partialTicks) {
    let raytrace = Player.getPlayer().func_174822_a(distance, partialTicks);
    ChatLib.chat(`${raytrace.field_72308_g}`);
    ChatLib.chat(raytrace.field_72313_a.toString());
    if (raytrace.field_72313_a.toString() === "BLOCK") {
        let blockpos = raytrace.func_178782_a();
        let block = World.getBlockAt(new BlockPos(blockpos));
        return block;
    }
    return null;
}


/** 
 * Draw multiple Blocks at specific coordinates (using dispaly lists)
 * @param {Array} positions An array of blocks coordinates to draw
 * @param {Number} r The red color value of the box
 * @param {Number} g The green color value of the box
 * @param {Number} b The blue color value of the box
 * @param {Number} a The alpha value of the box
 * @param {Boolean} depthTest Whether to use depth testing
 */
export function drawMultipleBlocksInWorld(positions, r, g, b, a, depthTest) {
    let displayList = GL11.glGenLists(1);
    GL11.glNewList(displayList, 4864);
    
    GL11.glDisable(GL11.GL_CULL_FACE);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glBlendFunc(770, 771);
    GL11.glDepthMask(false);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    if (!depthTest) GL11.glDisable(GL11.GL_DEPTH_TEST);

    GL11.glPushAttrib(GL11.GL_CURRENT_BIT); // save current color

    renderX = -(Player.getRenderX());
    renderY = -(Player.getRenderY());
    renderZ = -(Player.getRenderZ());

    positions.forEach((coords) => {
        GL11.glPushMatrix();
        drawNormalCube(renderX + coords[0], renderY + coords[1], renderZ + coords[2], r, g, b, a);
        GL11.glPopMatrix();
    });

    GL11.glPopAttrib() // restore previous color

    if (!depthTest) GL11.glEnable(GL11.GL_DEPTH_TEST);
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glDepthMask(true);
    GL11.glDisable(GL11.GL_BLEND);
    GL11.glEnable(GL11.GL_CULL_FACE);

    GL11.glEndList();
    GL11.glCallList(displayList);
    GL11.glDeleteLists(displayList, 1);
}