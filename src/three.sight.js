const sightInterface = {
    viewRadius: 7,
    viewAngle: 84,
    viewSegments: 32,
    rotateSpeed: 0.5
};
import * as THREE from 'three';

export default class Sight extends THREE.Object3D {
    constructor(sightProps = sightInterface) {
        super();
        
        this.sightProps = sightProps; 

        this.rotationAngle = 0;

        const geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3);

        const angleSize = this.sightProps.viewAngle / this.sightProps.viewSegments;
        const radius = this.sightProps.viewRadius;

        for (let i = 0; i < this.sightProps.viewSegments; i++) {
            const angle = -this.sightProps.viewAngle / 2 + angleSize * i;
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

        this.originVec3 = new THREE.Vector3;
        this.dirVec3 = new THREE.Vector3(0, 1, 0);

        this.raycaster = new THREE.Raycaster(this.originVec3, this.dirVec3, 0, 100);
    }


    dirFromAngle(angleInDegrees, angleIsGlobal) {
        let angleInRad = THREE.MathUtils.degToRad(angleInDegrees);
        if (!angleIsGlobal) {
            angleInRad += this.rotation.y;
        }

        return new THREE.Vector3(
            Math.sin(angleInRad),
            0,
            Math.cos(angleInRad)
        );
    }

    getIntersection(objs) {
        const angleSize = this.sightProps.viewAngle / this.sightProps.viewSegments;
        const radius = this.sightProps.viewRadius;

        this.updateWorldMatrix();
        this.getWorldPosition(this.originVec3);

        for (let i = 1; i < this.sightProps.viewSegments + 1; i++) {
            const angle = -this.sightProps.viewAngle / 2 + angleSize * i;
            
            const {x, z} = this.dirFromAngle(angle, false);

            this.dirVec3.set(radius * x, 0, radius * z).normalize();
            this.raycaster.set(this.originVec3, this.dirVec3);
            

            const inter = this.raycaster.intersectObjects(objs);

            if (inter.length > 0) {
                const {distance} = inter[0];
                const d = distance > radius ? radius : distance;
                const v = this.dirFromAngle(angle, true);
                this.mesh.geometry.vertices[i].x = d * v.x;
                this.mesh.geometry.vertices[i].z = d * v.z;
            } else {
                const v = this.dirFromAngle(angle, true);
                this.mesh.geometry.vertices[i].x = radius * v.x;
                this.mesh.geometry.vertices[i].z = radius * v.z;
            }

            this.mesh.geometry.computeVertexNormals();
            this.mesh.geometry.normalsNeedUpdate = true;
            this.mesh.geometry.verticesNeedUpdate = true;
        }
    }
}