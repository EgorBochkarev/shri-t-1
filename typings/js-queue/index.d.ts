declare module 'js-queue' {
    class JSQueue {
        next():void
        add(fn: () => void):void
        stop: boolean
        contents:() => void[] 
    }
    export default JSQueue
}
