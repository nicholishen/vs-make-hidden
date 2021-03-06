// Remove the workspace
// cd /Users/rhysdevine-davies/Library/Application\ Support/Code/User
// rm makeHidden.js

/* -- Third party import's -- */
import * as fs from 'fs';
import * as console from 'console';

/* -- Make hidden lib's -- */
import * as Util from '../utilities';

export interface WorkspaceLayout {
    id: string;
    name: string;
    path: string,
    excludedItems: any;
}

export default class WorkspaceManager {

    workspaces: WorkspaceLayout[] = [];
    projectRoot: string = '';

    /* --------------------
    */
    constructor(
        private settingPath: string = null
    ){ this.load(); }

    /* --------------------
    */
    public load( ){
        let path: string = this.settingPath;
        if( Util.fileExists( path ) ){
            try {
                this.workspaces = JSON.parse(
                    fs.readFileSync( path ).toString()
                );
            } catch {
                // console.lo bg( 'Failed to read file' );
            }
        } else {
            Util.creatFile( path, [] );
        }
    }

    /* --------------------
    */
    private save(){
        fs.writeFileSync( this.settingPath ,
            JSON.stringify( this.workspaces , null, "\t")
        );
    }

    /* --------------------
    */
    public create(
        name: string = null,
        excludedItems: any = null,
        path: string = 'global',
    ) {
        if( name && excludedItems ){
            this.workspaces.push( this.buildObject(
                name, path, excludedItems
            ) );

            this.save();
        }
    }

    /* --------------------
    */
    public getAll( forProject: boolean = true ): WorkspaceLayout[] {
        return this.workspaces;
    }

    /* --------------------
    */
    public removeById( id: string = null ) {
        for ( let index in this.workspaces ) {
            let workspaces = this.workspaces[ index ];
            if ( workspaces.id === id ) {
                this.workspaces.splice(Number(index), 1);
                this.save();
            }
        }
    }

    /* --------------------
    */
    public removeAll(){
        this.workspaces = [];
        fs.writeFileSync( this.settingPath ,
            JSON.stringify( [] , null, "\t")
        );
    }

    /* --------------------
    */
    public fidById( id: string = null ) : WorkspaceLayout {
        let foundWorkspace: any = [];
        for (let workspace of this.workspaces ) {
            if( workspace.id === id ){
                return workspace;
            }
        }
        return null;
    }

    /* --------------------
    */
    protected buildObject(
        name: string = 'Make Hidden Workspace',
        path: string = 'global',
        items: any = {},
    ) : WorkspaceLayout {
        return {
            "id" : this.guidGenerator(),
            "name": name,
            "path": path,
            "excludedItems": items
        }
    }

    /* --------------------
    */
    private guidGenerator(): string {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+"-"+S4());
    }
}
