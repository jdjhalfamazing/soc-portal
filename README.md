<img width="1908" height="951" alt="Screenshot 2026-07-14 at 5 25 30 pm" src="https://github.com/user-attachments/assets/69fa6543-76f2-44f8-bb22-42121a51e453" />
# 🛡️ SOC Portal

A full-stack Security Operations Center (SOC) Portal built with Spring Boot, PostgreSQL, Thymeleaf, and Spring Security. This application simulates the daily workflow of security analysts by providing centralized management for alerts, incidents, assets, vulnerabilities, users, and audit logs.

> **Note:** This is a cybersecurity portfolio project created for educational and demonstration purposes. All data displayed is fictional.

---

## 🚀 Live Demo

https://soc-portal-2g2f.onrender.com

---

# Features

## 🔐 Authentication

- Secure login with Spring Security
- Role-based authentication
- User session management
- Protected application routes

---

## 🚨 Alert Management

- Create alerts
- Edit alerts
- Delete alerts
- Search alerts
- Filter by severity
- Filter by status
- Indicator of Compromise (IOC) support
- Alert Details page
- Related Asset lookup

---

## 🚓 Incident Management

- Create incidents
- Update incidents
- Delete incidents
- Search incidents
- Incident Details page
- Priority tracking
- Assignment tracking

---

## 💻 Asset Management

- Asset inventory
- Operating System tracking
- IP Address tracking
- Criticality tracking
- Owner assignment
- Asset Details page

---

## 🛡 Vulnerability Management

- CVE Tracking
- CVSS Scores
- Severity management
- Status tracking
- Assigned analyst
- Vulnerability Details page

---

## 👥 User Management

- User administration
- Roles
- Departments
- Status tracking
- Last Login
- User creation
- User editing
- User deletion

---

## 📜 Audit Log

Track changes made throughout the application including:

- Create
- Update
- Delete

Across:

- Alerts
- Assets
- Incidents
- Vulnerabilities
- Users

---

## 🔔 Notifications

- Real-time notification menu
- Notification badges
- Clear notifications
- Alert activity tracking

---

## 📱 Responsive Design

Designed for:

- Desktop
- Tablet
- Mobile devices

---

# Technology Stack

### Backend

- Java 17
- Spring Boot
- Spring MVC
- Spring Security
- Spring Data JPA
- Hibernate

### Frontend

- HTML5
- CSS3
- JavaScript
- Thymeleaf

### Database

- PostgreSQL

### Deployment

- Docker
- Render

### Version Control

- Git
- GitHub

---

# Architecture

```
Browser
      │
      ▼
Spring Boot
      │
Spring MVC
      │
Spring Services
      │
Spring Data JPA
      │
PostgreSQL
```

---

# Project Structure

```
src
 ├── controller
 ├── service
 ├── repository
 ├── model
 ├── templates
 ├── static
 │     ├── css
 │     ├── js
 │     └── images
 └── resources
```

---

# Future Improvements

- Dashboard analytics
- Charts and graphs
- Email notifications
- REST API documentation
- Threat Intelligence integration
- SIEM integration
- File attachments
- Report generation (PDF/CSV)
- Multi-factor authentication

---

# Author

**Joseph Jordan**

Bachelor of Science in Computer Information Systems

Cybersecurity | Spring Boot | Java | PostgreSQL | Information Assurance

LinkedIn:
https://www.linkedin.com/in/josephjordan25/

---

# License

This project was created for educational and portfolio purposes.
