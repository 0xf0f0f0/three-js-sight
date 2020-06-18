const sightInterface = {
    viewRadius: 5,
    viewAngle: 44,
    viewSegments: 32,
    rotateSpeed: 0.5
};

export class Sight extends THREE.Object3D {
    constructor() {
        super();

        this.rotationAngle = 0;

        const geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3);

        const angleSize = sightInterface.viewAngle / sightInterface.viewSegments;
        const radius = sightInterface.viewRadius;

        for (let i = 0; i < sightInterface.viewSegments; i++) {
            const angle = -sightInterface.viewAngle / 2 + angleSize * i;
            const {x, y, z} = this.dirFromAngle(angle, false);
            geometry.vertices.push(new THREE.Vector3(radius * x, y, radius * z));
            if (i > 0) {
                geometry.faces.push(new THREE.Face3(0, i, i + 1));
            }
        }

        geometry.computeVertexNormals();
        geometry.computeFaceNormals();

        geometry.dynamic = true;

        const material = new THREE.MeshLambertMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        });

        const mesh = this.mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);

        this.ray = new THREE.Ray(new THREE.Vector3, new THREE.Vector3);
    }


    dirFromAngle(angleInDegrees, angleIsGlobal) {
        if (!angleIsGlobal) {
            angleInDegrees += this.rotationAngle;
        }

        return new THREE.Vector3(
            Math.sin(angleInDegrees * (Math.PI / 180)),
            0,
            Math.cos(angleInDegrees * (Math.PI / 180))
        );
    }

    getIntersection(obj) {

        const angleSize = sightInterface.viewAngle / sightInterface.viewSegments;
        const radius = sightInterface.viewRadius;

        const box = obj.geometry.boundingBox.clone();
        box.applyMatrix4(obj.matrixWorld);

        this.updateWorldMatrix();

        const baseXYZ = new THREE.Vector3;

        for (let i = 1; i < sightInterface.viewSegments + 1; i++) {
            const angle = -sightInterface.viewAngle / 2 + angleSize * i;
            const {x, z} = this.dirFromAngle(angle, false);
            this.ray.set(baseXYZ, new THREE.Vector3(radius * x, 0, radius * z));
            const intersectBox = this.ray.intersectBox(box, new THREE.Vector3);

            if (intersectBox) {
                this.mesh.geometry.vertices[i].x = intersectBox.x;
                this.mesh.geometry.vertices[i].z = intersectBox.z;
                
            } else {
                this.mesh.geometry.vertices[i].x = radius * x;
                this.mesh.geometry.vertices[i].z = radius * z;
            }

            this.mesh.geometry.computeVertexNormals();
            this.mesh.geometry.normalsNeedUpdate = true;
            this.mesh.geometry.verticesNeedUpdate = true;
        }
    }
}