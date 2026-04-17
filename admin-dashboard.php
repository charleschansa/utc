<?php
require_once __DIR__ . '/assets/api/db.php';

function h($value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

$dbError = '';
$contactRows = [];
$trainingRows = [];
$stats = [
    'contact_total' => 0,
    'training_total' => 0,
    'contact_today' => 0,
    'training_today' => 0,
];

try {
    $db = utc_db();

    // Ensure tables exist before querying the dashboard.
    $db->exec(
        'CREATE TABLE IF NOT EXISTS contact_inquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            email VARCHAR(190) NOT NULL,
            organization VARCHAR(190) NOT NULL,
            service VARCHAR(190) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_contact_inquiries_email (email),
            INDEX idx_contact_inquiries_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $db->exec(
        'CREATE TABLE IF NOT EXISTS training_registrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            source VARCHAR(120) NOT NULL DEFAULT "manual",
            course_name VARCHAR(255) DEFAULT NULL,
            course_date VARCHAR(120) DEFAULT NULL,
            course_location VARCHAR(255) DEFAULT NULL,
            course_duration VARCHAR(120) DEFAULT NULL,
            company_name VARCHAR(190) NOT NULL,
            company_address TEXT,
            company_phone VARCHAR(60),
            company_email VARCHAR(190) NOT NULL,
            delegate_count VARCHAR(30) NOT NULL,
            package_selection VARCHAR(60) NOT NULL,
            table_count INT DEFAULT NULL,
            manager_name VARCHAR(190) NOT NULL,
            manager_email VARCHAR(190) NOT NULL,
            manager_phone VARCHAR(60),
            manager_designation VARCHAR(190),
            terms_accepted TINYINT(1) NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_training_registrations_company_email (company_email),
            INDEX idx_training_registrations_course_name (course_name),
            INDEX idx_training_registrations_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $stats['contact_total'] = (int)$db->query('SELECT COUNT(*) FROM contact_inquiries')->fetchColumn();
    $stats['training_total'] = (int)$db->query('SELECT COUNT(*) FROM training_registrations')->fetchColumn();
    $stats['contact_today'] = (int)$db->query('SELECT COUNT(*) FROM contact_inquiries WHERE DATE(created_at) = CURDATE()')->fetchColumn();
    $stats['training_today'] = (int)$db->query('SELECT COUNT(*) FROM training_registrations WHERE DATE(created_at) = CURDATE()')->fetchColumn();

    $contactRows = $db->query(
        'SELECT id, name, email, organization, service, message, created_at
         FROM contact_inquiries
         ORDER BY id DESC
         LIMIT 200'
    )->fetchAll();

    $trainingRows = $db->query(
        'SELECT id, source, course_name, course_date, course_location, course_duration,
                company_name, company_email, delegate_count, package_selection, table_count,
                manager_name, manager_email, created_at
         FROM training_registrations
         ORDER BY id DESC
         LIMIT 200'
    )->fetchAll();
} catch (Throwable $e) {
    $dbError = 'Unable to load dashboard data. Check database connection and table permissions.';
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ultimate Training Consultants | Admin Dashboard</title>
    <meta
      name="description"
      content="UTC admin dashboard for viewing contact inquiries and registration form submissions."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Poppins:wght@600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="assets/css/styles.css" />
  </head>
  <body class="admin-page">
    <div id="site-header"></div>

    <main>
      <section class="section section-tight admin-hero">
        <div class="container">
          <span class="eyebrow no-eyebrow-icon">Admin</span>
          <h1>Form Submissions Dashboard</h1>
          <p class="lead">Monitor inquiries and training registrations in one place.</p>
        </div>
      </section>

      <section class="section section-tight">
        <div class="container">
          <?php if ($dbError !== ''): ?>
          <article class="card admin-alert-card">
            <h2>Dashboard Error</h2>
            <p><?= h($dbError) ?></p>
          </article>
          <?php else: ?>
          <div class="admin-stats-grid">
            <article class="card admin-stat-card">
              <h3>Total Contact Inquiries</h3>
              <p class="admin-stat-value"><?= h($stats['contact_total']) ?></p>
            </article>
            <article class="card admin-stat-card">
              <h3>Contact Inquiries Today</h3>
              <p class="admin-stat-value"><?= h($stats['contact_today']) ?></p>
            </article>
            <article class="card admin-stat-card">
              <h3>Total Training Registrations</h3>
              <p class="admin-stat-value"><?= h($stats['training_total']) ?></p>
            </article>
            <article class="card admin-stat-card">
              <h3>Registrations Today</h3>
              <p class="admin-stat-value"><?= h($stats['training_today']) ?></p>
            </article>
          </div>

          <div class="admin-tabs" data-admin-tabs>
            <div class="admin-tab-nav" role="tablist" aria-label="Dashboard data tabs">
              <button class="admin-tab-btn is-active" type="button" data-admin-tab-target="contact" role="tab" aria-selected="true">Contact Inquiries</button>
              <button class="admin-tab-btn" type="button" data-admin-tab-target="training" role="tab" aria-selected="false">Training Registrations</button>
            </div>

            <section class="admin-tab-panel is-active" data-admin-tab-panel="contact" role="tabpanel">
              <div class="admin-table-wrap">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Organization</th>
                      <th>Service</th>
                      <th>Message</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php if (count($contactRows) === 0): ?>
                    <tr>
                      <td colspan="7" class="admin-empty">No contact inquiries yet.</td>
                    </tr>
                    <?php else: ?>
                    <?php foreach ($contactRows as $row): ?>
                    <tr>
                      <td><?= h($row['id']) ?></td>
                      <td><?= h($row['name']) ?></td>
                      <td><a href="mailto:<?= h($row['email']) ?>"><?= h($row['email']) ?></a></td>
                      <td><?= h($row['organization']) ?></td>
                      <td><?= h($row['service']) ?></td>
                      <td class="admin-message-cell"><?= h($row['message']) ?></td>
                      <td><?= h($row['created_at']) ?></td>
                    </tr>
                    <?php endforeach; ?>
                    <?php endif; ?>
                  </tbody>
                </table>
              </div>
            </section>

            <section class="admin-tab-panel" data-admin-tab-panel="training" role="tabpanel" hidden>
              <div class="admin-table-wrap">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Company</th>
                      <th>Company Email</th>
                      <th>Delegates</th>
                      <th>Package</th>
                      <th>Manager</th>
                      <th>Manager Email</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php if (count($trainingRows) === 0): ?>
                    <tr>
                      <td colspan="11" class="admin-empty">No training registrations yet.</td>
                    </tr>
                    <?php else: ?>
                    <?php foreach ($trainingRows as $row): ?>
                    <tr>
                      <td><?= h($row['id']) ?></td>
                      <td><?= h($row['course_name'] ?: 'General Registration') ?></td>
                      <td><?= h($row['course_date']) ?></td>
                      <td><?= h($row['course_location']) ?></td>
                      <td><?= h($row['company_name']) ?></td>
                      <td><a href="mailto:<?= h($row['company_email']) ?>"><?= h($row['company_email']) ?></a></td>
                      <td><?= h($row['delegate_count']) ?></td>
                      <td>
                        <?= h($row['package_selection']) ?>
                        <?php if (!empty($row['table_count'])): ?>
                          <span class="admin-inline-meta">(Tables: <?= h($row['table_count']) ?>)</span>
                        <?php endif; ?>
                      </td>
                      <td><?= h($row['manager_name']) ?></td>
                      <td><a href="mailto:<?= h($row['manager_email']) ?>"><?= h($row['manager_email']) ?></a></td>
                      <td><?= h($row['created_at']) ?></td>
                    </tr>
                    <?php endforeach; ?>
                    <?php endif; ?>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          <?php endif; ?>
        </div>
      </section>
    </main>

    <div id="site-footer"></div>

    <script src="assets/js/components.js"></script>
    <script>
      window.UTCComponents.initPage({
        page: "admin"
      });

      (function () {
        const tabRoot = document.querySelector("[data-admin-tabs]");
        if (!tabRoot) return;

        const buttons = Array.from(tabRoot.querySelectorAll("[data-admin-tab-target]"));
        const panels = Array.from(tabRoot.querySelectorAll("[data-admin-tab-panel]"));

        function activateTab(target) {
          buttons.forEach((button) => {
            const active = button.getAttribute("data-admin-tab-target") === target;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-selected", active ? "true" : "false");
          });

          panels.forEach((panel) => {
            const active = panel.getAttribute("data-admin-tab-panel") === target;
            panel.classList.toggle("is-active", active);
            panel.hidden = !active;
          });
        }

        buttons.forEach((button) => {
          button.addEventListener("click", function () {
            activateTab(button.getAttribute("data-admin-tab-target"));
          });
        });
      })();
    </script>
  </body>
</html>
