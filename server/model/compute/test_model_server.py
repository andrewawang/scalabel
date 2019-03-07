import unittest
import model_server as ms
import multiprocessing
import signal

"""
Usage: Run 

python test_model_server.py

to see test result printout.
"""

class test_SessionWorker(unittest.TestCase):
    """
    Unit tests for class SessionWorker.
    """
    def test_init(self):
        """
        check that init works.
        """
        ms.ray.shutdown()
        ms.ray.init()
        self.assertTrue(ms.ray.is_initialized())
        sessionId = 'temp'
        tester = ms.SessionWorker.remote(sessionId)
        self.assertFalse(tester == None)
        self.assertFalse(tester.do_work.remote() == None)
        
        ms.ray.shutdown()

    def test_do_work(self):
        """
        check time within 1 second.
        """
        ms.ray.shutdown()
        ms.ray.init()
        self.assertTrue(ms.ray.is_initialized())

        sessionId = 'temp'
        tester = ms.SessionWorker.remote(sessionId)
        server_time = tester.do_work.remote()
        server_time = ms.ray.get(server_time)[:19]
        curr_time = str(ms.datetime.datetime.now())[:19]

        self.assertEqual(curr_time, server_time)

        ms.ray.shutdown()

def server_start():
    """
    Starts a server instance on new thread and returns thread.
    """
    p = multiprocessing.Process(target=ms.serve, args=())
    p.start()
    ms.time.sleep(1)
    return p

def server_stop(p):
    """
    Kills server instance via KeyboardInterrupt. Returns true if stopped.
    """
    signal.SIGTERM = signal.SIGINT
    p.terminate()
    ms.time.sleep(1)
    return not p.is_alive()

class test_serve(unittest.TestCase):
    """
    Unit tests for serve.
    """
    def test_pipeline(self):
        p = server_start()
        killed = server_stop(p)       
        self.assertTrue(killed)
        

class test_ModelServer(unittest.TestCase):
    """
    Unit tests for class ModelServer.
    """
    def test_init(self):
        """
        Check init.
        """
        init = ms.ModelServer()
        self.assertEqual(len(init.sessionIdsToWorkers), 0)



if __name__ == '__main__':
    unittest.main()
