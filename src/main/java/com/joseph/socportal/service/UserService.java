package com.joseph.socportal.service;

import com.joseph.socportal.model.User;
import com.joseph.socportal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final AuditLogService auditLogService;

    public UserService(
            UserRepository userRepository,
            AuditLogService auditLogService) {

        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {

        User savedUser = userRepository.save(user);

        auditLogService.log(
                "Joseph",
                user.getId() == null ? "Created" : "Updated",
                "User",
                savedUser.getUsername());

        return savedUser;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {

        User user = getUserById(id);

        auditLogService.log(
                "Joseph",
                "Deleted",
                "User",
                user.getUsername());

        userRepository.deleteById(id);
    }
}