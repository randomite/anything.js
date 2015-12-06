/**
 * Employ a web worker to do a job on another thread.
 * Workers are terminated after they respond with a result.
 * 
 * @param {object} data - An object of key-value pairs for data
 * @param {function} job - The job the worker is tasked with, as a function
 * @param {function} callback - Called when worker is done with the job
 * 
 * Example: sorting an array on a different thread.
 * 
     employWorker(
        { unsorted : Array.apply(null, Array(25000)).map(function() { return Math.floor(Math.random() * 10); }, 0) },
        function gnomesort(d) {
            var i = 0, a = d.unsorted;

            while (i < a.length) {
                if (i == 0 || a[i] >= a[i - 1]) {
                    i++;
                } else {
                    var t = a[i];
                    a[i] = a[i - 1];
                    a[--i] = t;
                }
            }

            return d.unsorted;
        },
        function complete(e) {
            alert(e.data);
        }
    );
 *
 */
var employWorker = function (data, job, callback) {
    var script = [
        "self.addEventListener('message', function(e) {" +
        "console.log(e.data);" +
        "var result = " + job.toString() + "(e.data);" +
        "postMessage(result);" +
        "close();" +
        "}, false);"
    ].join('\n');
    var blob = new Blob([script]);
    var worker = new Worker(URL.createObjectURL(blob));
    worker.addEventListener('message', callback, false);
    worker.postMessage(data);
};

anything.prototype.employWorker = employWorker;
