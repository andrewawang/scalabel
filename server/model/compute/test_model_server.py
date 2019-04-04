import unittest
import model_server as ms
import multiprocessing
import signal

"""
Usage: Run

python test_model_server.py

to see test result printout.
"""


class TestSessionWorker(unittest.TestCase):
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
        session_id = 'temp'
        tester = ms.SessionWorker.remote(session_id)
        self.assertFalse(tester is None)
        self.assertFalse(tester.do_work.remote() is None)

        ms.ray.shutdown()

    def test_do_work(self):
        """
        check time within 1 second.
        """
        ms.ray.shutdown()
        ms.ray.init()
        self.assertTrue(ms.ray.is_initialized())

        session_id = 'temp'
        tester = ms.SessionWorker.remote(session_id)
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


class TestServe(unittest.TestCase):
    """
    Unit tests for serve.
    """
    def test_pipeline(self):
        p = server_start()
        killed = server_stop(p)
        self.assertTrue(killed)


def startup(session_id='default'):
    ms.ray.shutdown()
    ms.ray.init()
    # p = server_start()
    session_worker = ms.SessionWorker.remote(session_id)
    model_server_session = ms.ModelServer()
    return session_worker, model_server_session


def shutdown():  # p
    # server_stop(p)
    ms.ray.shutdown()


class TestModelServer(unittest.TestCase):
    """
    Unit tests for class ModelServer.
    """
    def test_init(self):
        """
        Check init.
        """
        init = ms.ModelServer()
        self.assertEqual(len(init.sessionIdsToWorkers), 0)

    def test_dummy(self):
        session_id = 'dummy test'
        session_worker, model_server_session = startup(session_id)
        model_server_session.DummyComputation(session_worker, None)

        shutdown()  # thread


if __name__ == '__main__':
    unittest.main()
