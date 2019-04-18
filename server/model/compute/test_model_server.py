import unittest
import model_server as ms
import multiprocessing
import signal
import threading

"""
Usage: Run

python test_model_server.py

to see test result printout.

Todo: Fix force local use, do not use redis server.
      inline tasks
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
        ms.ray.init(num_cpus=100, ignore_reinit_error=True)
        self.assertTrue(ms.ray.is_initialized())
        session_id = 'temp'
        tester = ms.SessionWorker.remote(session_id)
        self.assertFalse(tester is None)
        self.assertFalse(tester.do_work.remote() is None)

        ms.ray.shutdown()

    def test_do_work(self, session_id = 'temp'):
        """
        check time within 1 second.
        """
        ms.ray.shutdown()
        ms.ray.init(num_cpus=100, ignore_reinit_error=True)
        self.assertTrue(ms.ray.is_initialized())

        tester = ms.SessionWorker.remote(session_id)
        server_time = tester.do_work.remote()
        server_time = ms.ray.get(server_time)[:19]
        curr_time = str(ms.datetime.datetime.now())[:19]

        self.assertEqual(curr_time, server_time)

        ms.ray.shutdown()

    def test_multiple_workers(self):
        """
        Todo: Add integration test with multiple workers.
        """
        threads = []
        for id in range(20):
            t = threading.Thread(target=self.test_do_work, args=(str(id),))
            threads.append(t)
            t.start()


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


def startup(session_id='default'):
    """
    Starts up session worker with session id.
    """
    ms.ray.shutdown()
    ms.ray.init(num_cpus=100, ignore_reinit_error=True)
    # p = server_start()
    session_worker = ms.SessionWorker.remote(session_id)
    model_server_session = ms.ModelServer()
    return session_worker, model_server_session


def shutdown():  # p
    """
    Shuts down ray server.
    """
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

    def test_register(self, session_id = 'register test'):
        """
        Test ModelServer.Register for correct pb2 response
        """
        session_worker, model_server_session = startup(session_id)
        response = model_server_session.Register(session_worker, None)

        server_time = response.modelServerTimestamp[:19]
        curr_time = str(ms.datetime.datetime.now())[:19]
        self.assertEqual(curr_time, server_time)

        self.assertTrue(int(response.modelServerDuration) > 0)

        self.assertEqual(response.session.sessionId, session_id)

        shutdown()

    def test_dummy(self, session_id = 'dummy test'):
        """
        Test ModelServer.DummyComputation for correct pb2 response
        """
        session_worker, model_server_session = startup(session_id)
        response = model_server_session.DummyComputation(session_worker, None)

        server_time = response.modelServerTimestamp[:19]
        curr_time = str(ms.datetime.datetime.now())[:19]
        self.assertEqual(curr_time, server_time)

        self.assertTrue(int(response.modelServerDuration) > 0)

        self.assertEqual(response.session.sessionId, session_id)

        shutdown()  # thread


    def test_multiple_dummy(self):
        """
        Todo: add integration test with multiple sessions.
        """
        threads = []
        for id in range(20):
            t = threading.Thread(target=self.test_dummy, args=(str(id),))
            threads.append(t)
            t.start()

    def test_multiple_register(self):
        """
        Todo: add integration test with multiple sessions.
        """
        threads = []
        for id in range(20):
            t = threading.Thread(target=self.test_register, args=(str(id),))
            threads.append(t)
            t.start()

class TestServe(unittest.TestCase):
    """
    Unit tests for serve.
    """
    def test_pipeline(self):
        p = server_start()
        killed = server_stop(p)
        self.assertTrue(killed)

    """
    Todo: add grpc and pb2 input testing.
    """


if __name__ == '__main__':
    unittest.main()
