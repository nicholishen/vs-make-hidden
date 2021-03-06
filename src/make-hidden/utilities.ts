"use strict";

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from "os";
import * as process from "process";

let VS_CODE_CONTEXT: any    = null;
const HOME_DIR: string      = os.homedir();
const PROJECTS_FILE: string = "makeHidden.json";

export function setVsCodeContext( context ){
    VS_CODE_CONTEXT = context;
}

/* --------------------
*/
export function getExtensionSettingPath(): string {
    let projectFile: string;

    const appData = process.env.APPDATA || (process.platform === "darwin" ? process.env.HOME + "/Library/Application Support" : "/var/local");
    const channelPath: string = this.getChannelPath();
    // console.log( appData );

    projectFile = path.join(appData, channelPath, "User", PROJECTS_FILE);
    // in linux, it may not work with /var/local, then try to use /home/myuser/.config
    if ( ( process.platform === "linux" ) && ( ! fs.existsSync( projectFile ) ) ) {
        projectFile = path.join( HOME_DIR, ".config/", channelPath, "User", PROJECTS_FILE );
    }

    return projectFile;
}

/* --------------------
*/
export function getChannelPath(): string {
    if (vscode.env.appName.indexOf("Insiders") > 0) {
        return "Code - Insiders";
    } else {
        return "Code";
    }
}

/* --------------------
*/
export function getVsCodeCurrentPath() {
    return vscode.workspace.rootPath;
}

/* --------------------
*/
export function getPathInfoFromPath( givenPath : string = null, ) : {  } {
    let extension: string = path.extname( givenPath );
    let pathName: string  = path.basename( givenPath );
    return {
        "basename"  : pathName,
        "filename"  : ( extension === '' )? pathName : pathName.slice(0, -extension.length ),
        "extension" : extension,
        "path"      : givenPath.slice(0, -pathName.length)
    }
}

/* --------------------
*/
export function getAllItemsInDir( directory: string = './' ) {
    var files = fs.readdirSync( directory );
    return files;
}

/* --------------------
*/
export function getProjectThemeDirectory( fileName : string  ){
    return VS_CODE_CONTEXT.asAbsolutePath( path.join(
        'resources', 'light', fileName
    ) );
}

/* --------------------
*/
export function getVscodeSettingPath( pathType: string = null ){
    let path: string = `${getVsCodeCurrentPath()}/.vscode/settings.json`;
    let pathInfo = getPathInfoFromPath( path );
        pathInfo['full'] = path;

    if( pathInfo.hasOwnProperty( pathType ) ){
        return pathInfo[ pathType ];
    }

    return pathInfo;
}

/* --------------------
    * Create vc setting.json directory
*/
export function createVscodeSettingJson(
    request_users_permission : boolean = true
) : void  {
    let noticeText: string = `No 'vscode/settings.json' has been found, would you like to create now`;
    let grantedText: string = 'Yes, Create File';

    vscode.window.showInformationMessage(
        noticeText, grantedText
    ).then( ( selection : string ) => {
        if( selection === grantedText ) {
            const info = getVscodeSettingPath( );

            // if( ! fileExists( info[ 'path' ] ) ){
            //     creatFolder( info[ 'path' ] )
            // }
            // creatFile( info['full'], `{}` );

            fs.mkdir( info[ 'path' ] , e =>  {
                fs.writeFile( info[ 'full' ] , `{}`, ( err ) =>  {
                    if ( err ) {
                        vscode.window.showInformationMessage(`Error creating settings.json in .vscode directory`);
                        throw err
                    };
                });
            } );
        }
    });
}

/* --------------------
*/
export function creatFolder( path: string = null ){
    fs.mkdir( path , e => {} );
}

/* --------------------
*/
export function creatFile(
    path: string = null,
    data: any = {}
) {
    fs.writeFileSync( path, JSON.stringify( data , null, "\t") );
}

/* --------------------
*/
export function fileExists( filePath : string = '' ){
    return fs.existsSync( filePath );
}

/* --------------------
*/
export function getItemFromJsonFile(
    fileFullPath: string = null,
    objectItem: string = null
){
    if( fileFullPath && objectItem ){
        try  {
            let readFile = JSON.parse( fs.readFileSync(
                fileFullPath, { encoding: 'utf8' }
            ) );
            if( readFile.hasOwnProperty( objectItem ) ) {
                return readFile[ objectItem ];
            }
            else {
                return { "__error" : 'Not found' };
            }
        }
        catch (err)  {
            return { "__error" : 'File not found' };
        }
    }

    return { "__error" : `fileFullPath & objectItem not set` };
}

/* --------------------
*/
export function isVsCodeFileObject( obj : any = null ) : boolean {
    if( typeof obj == 'object' ) {
        for ( let prop in obj )  {
            if( prop == 'fsPath') {
                return true;
            }
        }
    }
    return false;
}