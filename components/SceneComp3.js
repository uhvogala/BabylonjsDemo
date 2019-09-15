import React from 'react';
import { StyleSheet, Text, View  } from 'react-native';
import AssetUtils from 'expo-asset-utils';
import { readAsStringAsync } from 'expo-file-system';
import { Asset } from 'react-native-unimodules';

import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
// import { Color3 } from "@babylonjs/core/Maths/math.color";

// import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial";
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';

import { Mesh } from "@babylonjs/core/Meshes/mesh";
// for basic shapes
import "@babylonjs/core/Meshes/meshBuilder";

import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { GLTFLoader } from '@babylonjs/loaders/glTF/2.0/glTFLoader';

// for compressed glb files
import '@babylonjs/loaders/glTF/2.0';
// for dds image
import '@babylonjs/core/Materials/Textures/Loaders/ddsTextureLoader';
import '@babylonjs/core/Materials/PBR/pbrBaseMaterial';
// import { PBRBaseMaterial } from '@babylonjs/core/Materials/PBR/pbrBaseMaterial';

import SceneTemplate from '../SceneTemplate';

class SceneComp3 extends React.Component {
    onInitScene = async (scene) => {
        var CustomParseLoader = (loader) => {
            loader.onParsedObservable.add(data => {
                // alert('CustomParseLoader ')
                alert('1CustomParseLoader ' + JSON.stringify(data.json))
                // alert('2CustomParseLoader ' + JSON.stringify(data.bin))
                /// const json = data.json;
                // const buffer = json.buffers[0].uri
                // alert(buffer)
            });
        }

        var CustomMaterialLoader = function (loader) {
            this.name = "CustomMaterialLoader";
            this.enabled = true;
            //alert('CustomMaterialLoader '+ JSON.stringify(loader));

            this.createMaterial = function (context, material, babylonDrawMode) {
                //alert(JSON.stringify(babylonDrawMode))
                // find a way to let this pass
                // material.environmentBRDFTexture = null;
                return material;
            }

            this.loadMaterialPropertiesAsync = function (context, material, babylonMaterial) {
    
                material.environmentBRDFTexture = null;
                var promises = [];
                var pbrMetallicRoughness = material.pbrMetallicRoughness;
                if (pbrMetallicRoughness) {
                    if (pbrMetallicRoughness.baseColorTexture) {
                        promises.push(
                            loader.loadTextureInfoAsync(
                                context + "/pbrMetallicRoughness/baseColorTexture",
                                pbrMetallicRoughness.baseColorTexture,
                                async function (babylonTexture) {
                                    alert('1 ',babylonTexture);
                                    // babylonMaterial.albedoTexture = Texture.LoadFromDataString("image", babylonTexture, scene);
                                    const url = 'https://preview.smarteam3d.com/build/image2.jpg';
                                    const asset = await AssetUtils.resolveAsync(url);
                                    babylonMaterial.albedoTexture = Texture.LoadFromDataString("image", asset, scene);
                                }
                            )
                        );
                    }
                }
            
                return Promise.all(promises);
                // material.environmentBRDFTexture = null;
            }
        }

        GLTFLoader.RegisterExtension("CustomMaterialLoader", function (loader) { return new CustomMaterialLoader(loader); });
        SceneLoader.OnPluginActivatedObservable.addOnce(function (loader) { return new CustomParseLoader(loader); });

        // This creates and positions a arcRotate camera
        const camera = new ArcRotateCamera("ArcRotateCamera", 2, 1.45, 10, new Vector3(0, 0, 0), scene);
        camera.upperBetaLimit = Math.PI / 2;
        camera.lowerRadiusLimit = 5;
        camera.upperRadiusLimit = 25;
        
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7; 

        // const ms = (await SceneLoader.ImportMeshAsync('', "https://preview.smarteam3d.com/build/", "cylinder2.gltf", scene, null, '.gltf')).meshes;
        // const ms = (await SceneLoader.ImportMeshAsync('', 'https://preview.smarteam3d.com/build/', 'cylinder.glb', scene, null, '.glb')).meshes;
        // const ms = (await SceneLoader.ImportMeshAsync('', 'https://preview.smarteam3d.com/build/', 'cylinder2.gltf', scene, null, '.gltf')).meshes;
        // alert(ms);
        
        // Load glb from local
        // const glb = Asset.fromModule(require('./assets/gagica.glb'));
        // await glb.downloadAsync();
        // alert(JSON.stringify(glb))
        // const asset2 = await AssetUtils.resolveAsync(glb.localUri);
        // alert(JSON.stringify(asset2))
        // Load glb from server
        // const url2 = 'https://preview.smarteam3d.com/build/cylinder.glb';
        // let asset2 = await AssetUtils.resolveAsync(url2);
        
        // alert(JSON.stringify(asset2))
        // asset2 = 'data:' + asset2;

        // let response = await fetch(url2);
        // let responseJson = await response.arrayBuffer();
        // alert(JSON.stringify(responseJson))
        // asset2 = 'data:'+ JSON.stringify(responseJson);
        // alert(JSON.stringify(responseJson))
        
        // alert('22 '+ JSON.stringify(asset2))
        // const ms = (await SceneLoader.ImportMeshAsync('', 'https://preview.smarteam3d.com/build/', 'cylinder.glb', scene, null, '.glb')).meshes;
        // alert(ms);
        // SceneLoader.AppendAsync("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF/CesiumMan.gltf").then(function () {
    
        // SceneLoader.ImportMesh("", "", "data:" + responseJson, scene2, function (newMeshes) {
        //    console.log("newMeshes: " + newMeshes);
        //});
    
        // alert(ms.length)

        //const modelAsset = Asset.fromModule(require('./assets/wooden-duck.obj'));
        //await modelAsset.downloadAsync();
        //const loader = new THREE.OBJLoader();
        //const model = loader.parse(
        //await Expo.FileSystem.readAsStringAsync(modelAsset.localUri))
    }

    render() {
        return (
          <View style={ styles.container }>
            <Text>{ this.props.name }</Text>
            <SceneTemplate onInitScene={ this.onInitScene }/>
          </View>
        );
    }
}
    
const styles = StyleSheet.create({  
    container: {  
    flex: 1,  
    padding: 15
    }
});  

export default SceneComp3;