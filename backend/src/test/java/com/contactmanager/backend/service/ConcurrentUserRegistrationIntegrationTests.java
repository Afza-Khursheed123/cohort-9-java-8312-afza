package com.contactmanager.backend.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.contactmanager.backend.dto.RegistrationRequest;
import com.contactmanager.backend.dto.RegistrationResponse;
import com.contactmanager.backend.repository.UserRepository;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:registration-test;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class ConcurrentUserRegistrationIntegrationTests {

    @Autowired
    private UserRegistrationService registrationService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void clearUsers() {
        userRepository.deleteAll();
    }

    @Test
    void concurrentRegistrationForSameIdentifierReturnsAcceptedWithoutRollbackFailure() throws Exception {
        RegistrationRequest request = new RegistrationRequest(
                "Test", "User", "Concurrent@Example.com", null, "valid-password");
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch start = new CountDownLatch(1);

        try (ExecutorService executor = Executors.newFixedThreadPool(2)) {
            List<Future<RegistrationResponse>> results = List.of(
                    executor.submit(() -> registerWhenReleased(request, ready, start)),
                    executor.submit(() -> registerWhenReleased(request, ready, start)));

            ready.await();
            start.countDown();

            RegistrationResponse first = results.get(0).get();
            RegistrationResponse second = results.get(1).get();

            assertThat(first).isEqualTo(second);
            assertThat(userRepository.count()).isEqualTo(1);
        }
    }

    private RegistrationResponse registerWhenReleased(RegistrationRequest request,
            CountDownLatch ready, CountDownLatch start) throws InterruptedException {
        ready.countDown();
        start.await();
        return registrationService.register(request);
    }
}
