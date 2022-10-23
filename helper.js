
const AxisAlignedBB = Java.type("net.minecraft.util.AxisAlignedBB");
const Vec3 = Java.type("net.minecraft.util.Vec3"); // subtract func_178788_d normalize func_72432_b dot func_72430_b

/**
 * Checks if the look vector of the player intersects the AABB of an entity
 * @param {*} playerLookVector Player look vector
 * @param {*} aabb Entity AABB
 * @param {Player} player The player 
 * @param {Number} distance maximum ray trace distance
 * @returns {Boolean} Returns true if the look vector intersects the AABB or false if not 
 */
export function isVectorInAABB(playerLookVector, aabb, player, distance) {
    let xPlayer = player.getLastX();
    let yPlayer = player.getLastY() + Player.getPlayer().func_70047_e();
    let zPlayer = player.getLastZ();

    let x = playerLookVector.field_72450_a;
    let y = playerLookVector.field_72448_b;
    let z = playerLookVector.field_72449_c;

    let start = 1;
    let add = 0.1
    let stop = (distance / add);

    while(start < stop) {
        if(aabb.func_72318_a(new Vec3(xPlayer + x*(add*start),
                             yPlayer + y*(add*start),
                             zPlayer + z*(add*start)))) {
            return true;
        }
        start++;
    }
    return false;
}

/**
 * prepares the cube to be drawn
 * @param {Number} x x position
 * @param {Number} y y position
 * @param {Number} z z position
 * @param {Number} r red
 * @param {Number} g green
 * @param {Number} b blue
 * @param {Number} a alpha
 */
export function drawNormalCube(x, y, z, r, g, b, a) {
    GL11.glTranslatef(x-0.5, y+0.5, z+0.5);
    GL11.glBegin(GL11.GL_QUADS);
    GL11.glColor4f(r, g, b, a);
    GL11.glVertex3f(0.5, 0.5, -0.5);
    GL11.glVertex3f(-0.5, 0.5, -0.5);
    GL11.glVertex3f(-0.5, 0.5, 0.5);
    GL11.glVertex3f(0.5, 0.5, 0.5);

    // Bottom face (y = -0.5)
    GL11.glVertex3f(0.5, -0.5, 0.5);
    GL11.glVertex3f(-0.5, -0.5, 0.5);
    GL11.glVertex3f(-0.5, -0.5, -0.5);
    GL11.glVertex3f(0.5, -0.5, -0.5);

    // Front face  (z = 0.5)
    GL11.glVertex3f(0.5, 0.5, 0.5);
    GL11.glVertex3f(-0.5, 0.5, 0.5);
    GL11.glVertex3f(-0.5, -0.5, 0.5);
    GL11.glVertex3f(0.5, -0.5, 0.5);

    // Back face (z = -0.5)
    GL11.glVertex3f(0.5, -0.5, -0.5);
    GL11.glVertex3f(-0.5, -0.5, -0.5);
    GL11.glVertex3f(-0.5, 0.5, -0.5);
    GL11.glVertex3f(0.5, 0.5, -0.5);

    // Left face (x = -0.5)
    GL11.glVertex3f(-0.5, 0.5, 0.5);
    GL11.glVertex3f(-0.5, 0.5, -0.5);
    GL11.glVertex3f(-0.5, -0.5, -0.5);
    GL11.glVertex3f(-0.5, -0.5, 0.5);

    // Right face (x = 0.5)
    GL11.glVertex3f(0.5, 0.5, -0.5);
    GL11.glVertex3f(0.5, 0.5, 0.5);
    GL11.glVertex3f(0.5, -0.5, 0.5);
    GL11.glVertex3f(0.5, -0.5, -0.5);
    GL11.glEnd();
}