declare module 'ansi-to-html' {
    class Convert {
        constructor(settings:Settings)
        toHtml(ansi:string):string
    }
    type Settings = {
        fg:string
        bg:string
        newline:boolean
        escapeXML:boolean
        stream:boolean
    }
    export default Convert
}
