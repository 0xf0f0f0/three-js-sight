# Sight

## Usage

### Demo
 [Example](https://geekofcola.github.io/three-js-sight/build)

### -> Constructor
    const sight = new SightThree(props, material = new THREE[Material]);
    props.viewRadius: number = default 5;
    props.viewAngle: number = default 50;
    props.viewSegments: number = default 32

### Init

```
    #THREE.Geometry
    const sight = new SightTree({
        viewRadius: 5,
        viewAngle: 50,
        viewSegments: 32
    });
    this.scene.add(sight);

    sight.getIntersections([mesh, mesh1]);

    #THREE.BufferGeometry
    const sight = new SightTree(this.scene, {
        viewRadius: 5,
        viewAngle: 50,
        viewSegments: 32
    });
    sight.getIntersections([mesh, mesh1]);
```
